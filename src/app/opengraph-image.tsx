import { ImageResponse } from 'next/og';

export const alt = 'Shivam Pratap Raj — Software Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: '#050505',
          color: '#f2f0ea',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 22, letterSpacing: 4, color: '#8a8780' }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#ff5b1f' }} />
          SPR-THREE.VERCEL.APP
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Shivam Pratap Raj</div>
          <div style={{ marginTop: 24, fontSize: 40, color: '#c9c6bf' }}>
            Backend engineer building APIs &amp; systems that stay
          </div>
          <div style={{ fontSize: 40, color: '#ff5b1f' }}>fast and correct at scale.</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: 26 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ color: '#f2f0ea' }}>Associate Software Engineer @ Carelon Global Solutions</div>
            <div style={{ color: '#8a8780' }}>ex-LEAP Finance · NIT Kurukshetra</div>
          </div>
          <div style={{ fontSize: 120, fontWeight: 700, color: '#ff5b1f', lineHeight: 0.8 }}>SPR</div>
        </div>
      </div>
    ),
    size,
  );
}
