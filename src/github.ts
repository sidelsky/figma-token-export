// GitHub API integration for pushing design tokens
// Uses GitHub REST API v3 to create/update files in a repository

export interface GitHubConfig {
    token: string;
    owner: string;
    repo: string;
    branch: string;
    filePath: string;
}

export interface GitHubPushOptions {
    config: GitHubConfig;
    content: string;
    commitMessage: string;
}

export interface GitHubPushResult {
    success: boolean;
    message: string;
    commitUrl?: string;
}

/**
 * Push content to a GitHub repository
 * Creates or updates a file with the given content
 */
export async function pushToGitHub(
    options: GitHubPushOptions
): Promise<GitHubPushResult> {
    const { config, content, commitMessage } = options;
    const { token, owner, repo, branch, filePath } = config;

    try {
        // Step 1: Get the current file SHA (if it exists)
        const sha = await getFileSHA(config);

        // Step 2: Create or update the file
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
            {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: commitMessage,
                    content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
                    branch: branch,
                    ...(sha ? { sha } : {}), // Include SHA if file exists
                }),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            throw new Error(
                error.message || `GitHub API error: ${response.statusText}`
            );
        }

        const result = await response.json();

        return {
            success: true,
            message: 'Successfully pushed to GitHub!',
            commitUrl: result.commit?.html_url,
        };
    } catch (error) {
        console.error('GitHub push error:', error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to push to GitHub. Please check your settings.',
        };
    }
}

/**
 * Get the SHA of an existing file in the repository
 * Returns null if the file doesn't exist
 */
async function getFileSHA(config: GitHubConfig): Promise<string | null> {
    const { token, owner, repo, branch, filePath } = config;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (response.status === 404) {
            // File doesn't exist yet
            return null;
        }

        if (!response.ok) {
            throw new Error(`Failed to get file info: ${response.statusText}`);
        }

        const data = await response.json();
        return data.sha;
    } catch (error) {
        // If file doesn't exist, return null
        console.log('File does not exist yet, will create new file');
        return null;
    }
}

/**
 * Validate GitHub configuration
 * Checks if the repository exists and is accessible
 */
export async function validateGitHubConfig(
    config: Omit<GitHubConfig, 'filePath'>
): Promise<{ valid: boolean; message: string }> {
    const { token, owner, repo } = config;

    try {
        const response = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                },
            }
        );

        if (response.status === 404) {
            return {
                valid: false,
                message: 'Repository not found. Please check the owner and repo name.',
            };
        }

        if (response.status === 401) {
            return {
                valid: false,
                message: 'Invalid token. Please check your GitHub Personal Access Token.',
            };
        }

        if (!response.ok) {
            return {
                valid: false,
                message: `GitHub API error: ${response.statusText}`,
            };
        }

        const repoData = await response.json();

        // Check if we have push access
        if (!repoData.permissions?.push) {
            return {
                valid: false,
                message: 'You do not have push access to this repository.',
            };
        }

        return {
            valid: true,
            message: `Connected to ${repoData.full_name}`,
        };
    } catch (error) {
        return {
            valid: false,
            message:
                error instanceof Error
                    ? error.message
                    : 'Failed to validate GitHub configuration',
        };
    }
}

/**
 * Parse repository URL to extract owner and repo name
 * Supports formats:
 * - https://github.com/owner/repo
 * - git@github.com:owner/repo.git
 * - owner/repo
 */
export function parseRepoUrl(
    url: string
): { owner: string; repo: string } | null {
    // Remove trailing slash and .git
    const cleaned = url.trim().replace(/\/$/, '').replace(/\.git$/, '');

    // Pattern 1: https://github.com/owner/repo
    const httpsMatch = cleaned.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (httpsMatch && httpsMatch[1] && httpsMatch[2]) {
        return { owner: httpsMatch[1], repo: httpsMatch[2] };
    }

    // Pattern 2: git@github.com:owner/repo
    const sshMatch = cleaned.match(/git@github\.com:([^/]+)\/(.+)/);
    if (sshMatch && sshMatch[1] && sshMatch[2]) {
        return { owner: sshMatch[1], repo: sshMatch[2] };
    }

    // Pattern 3: owner/repo
    const shortMatch = cleaned.match(/^([^/]+)\/([^/]+)$/);
    if (shortMatch && shortMatch[1] && shortMatch[2]) {
        return { owner: shortMatch[1], repo: shortMatch[2] };
    }

    return null;
}
