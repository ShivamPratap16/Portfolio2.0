'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Node {
  id: number;
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
}

interface Edge {
  source: number;
  target: number;
}

interface Packet {
  sourceId: number;
  targetId: number;
  progress: number;
  speed: number;
}

export default function ServerCluster() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // State
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    let packets: Packet[] = [];
    
    // Config
    const NUM_NODES = 25;
    const RADIUS = 120;
    const FOCAL_LENGTH = 300;
    const CAMERA_Z = 250;

    // Rotation state
    let angleX = 0;
    let angleY = 0;
    let targetAngleX = 0;
    let targetAngleY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Generate Nodes on a sphere
    for (let i = 0; i < NUM_NODES; i++) {
      const phi = Math.acos(-1 + (2 * i) / NUM_NODES);
      const theta = Math.sqrt(NUM_NODES * Math.PI) * phi;
      nodes.push({
        id: i,
        baseX: RADIUS * Math.cos(theta) * Math.sin(phi),
        baseY: RADIUS * Math.sin(theta) * Math.sin(phi),
        baseZ: RADIUS * Math.cos(phi),
        x: 0, y: 0, z: 0,
      });
    }

    // Generate Edges (connect to 2-3 nearest neighbors)
    nodes.forEach((node) => {
      const distances = nodes
        .filter((n) => n.id !== node.id)
        .map((n) => ({
          id: n.id,
          dist: Math.hypot(n.baseX - node.baseX, n.baseY - node.baseY, n.baseZ - node.baseZ),
        }))
        .sort((a, b) => a.dist - b.dist);

      // Connect to 2 nearest neighbors to create a web
      for (let i = 0; i < 2; i++) {
        // avoid duplicate undirected edges
        const exists = edges.some(
          (e) => (e.source === node.id && e.target === distances[i].id) ||
                 (e.target === node.id && e.source === distances[i].id)
        );
        if (!exists) {
          edges.push({ source: node.id, target: distances[i].id });
        }
      }
    });

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
        // Handle high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', resize);
    resize();

    // 3D Math
    const rotateX = (y: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { y: y * cos - z * sin, z: y * sin + z * cos };
    };

    const rotateY = (x: number, z: number, angle: number) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: x * cos + z * sin, z: -x * sin + z * cos };
    };

    const project = (x: number, y: number, z: number) => {
      const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z + CAMERA_Z);
      return {
        x: x * scale + width / 2,
        y: y * scale + height / 2,
        scale,
      };
    };

    // Interaction Handlers
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - lastMouseX;
      const deltaY = clientY - lastMouseY;
      
      targetAngleY += deltaX * 0.005;
      targetAngleX += deltaY * 0.005;
      
      lastMouseX = clientX;
      lastMouseY = clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleClick = () => {
      // Send 3 random packets on click
      for(let i=0; i<3; i++) {
        const randomEdge = edges[Math.floor(Math.random() * edges.length)];
        // 50% chance to go backwards
        const isReverse = Math.random() > 0.5;
        packets.push({
          sourceId: isReverse ? randomEdge.target : randomEdge.source,
          targetId: isReverse ? randomEdge.source : randomEdge.target,
          progress: 0,
          speed: 0.02 + Math.random() * 0.02
        });
      }
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('touchstart', handleMouseDown);
    canvas.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    // Initial packets
    setTimeout(handleClick, 1000);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Auto rotation + drag inertia
      if (!isDragging) {
        targetAngleY += 0.002; // slow spin
      }
      angleX += (targetAngleX - angleX) * 0.1;
      angleY += (targetAngleY - angleY) * 0.1;

      // Update node 3D positions
      nodes.forEach((node) => {
        let { y, z } = rotateX(node.baseY, node.baseZ, angleX);
        let { x, z: newZ } = rotateY(node.baseX, z, angleY);
        node.x = x;
        node.y = y;
        node.z = newZ;
      });

      // Sort nodes by Z-index for depth rendering (painters algorithm)
      const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);

      // Draw Edges
      ctx.lineWidth = 1;
      edges.forEach((edge) => {
        const s = nodes[edge.source];
        const t = nodes[edge.target];
        const p1 = project(s.x, s.y, s.z);
        const p2 = project(t.x, t.y, t.z);
        
        // Fade lines based on average depth
        const avgZ = (s.z + t.z) / 2;
        const alpha = Math.max(0.1, 1 - (avgZ + RADIUS) / (RADIUS * 2.5));
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(82, 82, 82, ${alpha})`; // text-ash color
        ctx.stroke();
      });

      // Update & Draw Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;
        
        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const s = nodes[p.sourceId];
        const t = nodes[p.targetId];
        
        // Lerp 3D position
        const px = s.x + (t.x - s.x) * p.progress;
        const py = s.y + (t.y - s.y) * p.progress;
        const pz = s.z + (t.z - s.z) * p.progress;
        
        const proj = project(px, py, pz);
        const alpha = Math.max(0.2, 1 - (pz + RADIUS) / (RADIUS * 2));

        // Draw glowing packet
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 2.5 * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74, 222, 128, ${alpha})`; // terminal green #4ade80
        ctx.fill();
        
        // Add a subtle glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#4ade80';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Nodes
      sortedNodes.forEach((node) => {
        const proj = project(node.x, node.y, node.z);
        const alpha = Math.max(0.2, 1 - (node.z + RADIUS) / (RADIUS * 2));
        
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 229, 229, ${alpha})`; // text-ink
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleMouseDown);
      canvas.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10">
      <div className="relative w-full max-w-[300px] aspect-square cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ touchAction: 'none' }}
        />
      </div>
      <p className="mt-2 text-[10px] sm:text-[11px] tracking-wide text-ash text-center leading-tight">
        interactive cluster — <span className="text-mute">drag</span> to rotate · <span className="text-mute">click</span> to send packets
      </p>
    </div>
  );
}
