'use client';

import { useEffect, useState } from 'react';
import BlurFadeIn from '../ui/BlurFadeIn';
import SectionHeading from '../ui/SectionHeading';

interface GitHubStats {
  followers: number;
  public_repos: number;
  total_commits?: number;
}

export default function LiveStats() {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetching basic user stats from GitHub API
        const res = await fetch('https://api.github.com/users/ShivamPratap16');
        const data = await res.json();
        
        setStats({
          followers: data.followers,
          public_repos: data.public_repos,
        });
      } catch (error) {
        console.error('Error fetching GitHub stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="mt-8 border border-hairline bg-surface-soft p-4 sm:p-6 rounded-lg">
      <h3 className="text-xs uppercase tracking-wider text-mute mb-4">Live GitHub Status</h3>
      
      {loading ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-hairline rounded w-1/4"></div>
          <div className="h-4 bg-hairline rounded w-1/4"></div>
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 gap-4 sm:flex sm:gap-8">
          <div>
            <div className="text-2xl font-bold text-[var(--color-accent)]">{stats.public_repos}</div>
            <div className="text-[10px] text-mute uppercase">Public Repos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-ink">{stats.followers}</div>
            <div className="text-[10px] text-mute uppercase">Followers</div>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start">
            <a 
              href="https://github.com/ShivamPratap16" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-mute hover:text-[var(--color-accent)] underline decoration-hairline underline-offset-4 transition-colors"
            >
              View Profile ↗
            </a>
          </div>
        </div>
      ) : (
        <div className="text-xs text-mute">Failed to load live stats.</div>
      )}
    </div>
  );
}
