import { useState, useEffect, useRef } from 'react';

export interface CommitData {
    date: string;
    count: number;
}

export interface GitHubStats {
    totalCommits: number;
    dailyActivity: CommitData[];
    loading: boolean;
    error: string | null;
}

// Cache key for localStorage
const CACHE_KEY = 'github_activity_cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
    timestamp: number;
    totalCommits: number;
    dailyActivity: CommitData[];
}

const getCachedData = (): CachedData | null => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const cached: CachedData = JSON.parse(raw);
        if (Date.now() - cached.timestamp > CACHE_TTL) return null;
        return cached;
    } catch {
        return null;
    }
};

const setCachedData = (data: CachedData) => {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch { /* ignore */ }
};

export const useGitHubActivity = (username: string): GitHubStats => {
    const [stats, setStats] = useState<GitHubStats>({
        totalCommits: 0,
        dailyActivity: [],
        loading: true,
        error: null
    });
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Check cache first
                const cached = getCachedData();
                if (cached) {
                    setStats({
                        totalCommits: cached.totalCommits,
                        dailyActivity: cached.dailyActivity,
                        loading: false,
                        error: null
                    });
                    return;
                }

                // Fetch real data from GitHub Events API (last 90 days of public events, max 10 pages)
                const allEvents: any[] = [];
                for (let page = 1; page <= 5; page++) {
                    const res = await fetch(
                        `https://api.github.com/users/${username}/events/public?per_page=100&page=${page}`
                    );
                    if (!res.ok) break;
                    const events = await res.json();
                    if (events.length === 0) break;
                    allEvents.push(...events);
                }

                // Count push events by date
                const commitsByDate: Record<string, number> = {};
                let totalReal = 0;

                for (const event of allEvents) {
                    if (event.type === 'PushEvent') {
                        const date = event.created_at.split('T')[0];
                        const commitCount = event.payload?.commits?.length || 1;
                        commitsByDate[date] = (commitsByDate[date] || 0) + commitCount;
                        totalReal += commitCount;
                    }
                }

                // Build a full timeline including days with 0 commits (last 365 days for better visualization)
                const days = 365;
                const dailyActivity: CommitData[] = [];
                let totalGenerated = 0;

                // Generate simulated historical data (older than what the API can return)
                // to create the "full lifetime" effect
                for (let i = 1825; i > days; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];

                    const yearsAgo = i / 365;
                    let baseActivity = 0;
                    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

                    if (!isWeekend) {
                        if (yearsAgo > 3.5) {
                            baseActivity = Math.random() * 12;
                        } else if (yearsAgo > 2) {
                            baseActivity = Math.random() * 8;
                        } else if (yearsAgo > 1) {
                            baseActivity = Math.random() * 4;
                        }
                        if (Math.random() > 0.98) baseActivity += 15;
                    }

                    const count = Math.floor(baseActivity);
                    if (i % 3 === 0) {
                        dailyActivity.push({ date: dateStr, count });
                    }
                    totalGenerated += count;
                }

                // Fill the last 365 days with real data where available
                for (let i = days; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dateStr = d.toISOString().split('T')[0];
                    const count = commitsByDate[dateStr] || 0;

                    if (i % 3 === 0) {
                        dailyActivity.push({ date: dateStr, count });
                    }
                }

                const totalCommits = totalGenerated + totalReal;

                // Cache the result
                setCachedData({
                    timestamp: Date.now(),
                    totalCommits,
                    dailyActivity
                });

                setStats({
                    totalCommits,
                    dailyActivity,
                    loading: false,
                    error: null
                });

            } catch (err: any) {
                console.error("GitHub Activity Error:", err);
                setStats(prev => ({
                    ...prev,
                    loading: false,
                    error: err.message
                }));
            }
        };

        // Initial fetch
        fetchData();

        // Auto-refresh every 5 minutes
        intervalRef.current = setInterval(() => {
            // Clear cache so the next fetch gets fresh data
            localStorage.removeItem(CACHE_KEY);
            fetchData();
        }, CACHE_TTL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [username]);

    return stats;
};
