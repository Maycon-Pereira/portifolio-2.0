
export interface GitHubRepo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    language: string | null;
    stargazers_count: number;
    updated_at: string;
    size: number;
}

export const fetchGitHubRepos = async (username: string): Promise<GitHubRepo[]> => {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch GitHub repos:", error);
        return [];
    }
};
