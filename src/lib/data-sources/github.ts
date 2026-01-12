import axios from 'axios';

const GITHUB_API_BASE = 'https://api.github.com';

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  topics: string[];
}

export class GithubClient {
  private readonly languages = ['TypeScript', 'Python', 'JavaScript', 'Rust', 'Go'];

  /**
   * 特定言語のトレンドリポジトリを取得
   * GitHub API制限を避けるため、検索APIを使用
   */
  async getTrendingRepos(language?: string, limit: number = 10): Promise<GithubRepo[]> {
    try {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const dateStr = lastWeek.toISOString().split('T')[0];

      let query = `created:>${dateStr} stars:>100`;
      if (language) {
        query += ` language:${language}`;
      }

      const response = await axios.get(`${GITHUB_API_BASE}/search/repositories`, {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: limit,
        },
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TechDigest/1.0'
        }
      });

      return response.data.items;
    } catch (error) {
      console.error(`Failed to fetch GitHub trending for ${language}:`, error);
      return [];
    }
  }

  /**
   * 複数言語のトレンドを取得
   */
  async getTechTrends(keywords: string[]): Promise<GithubRepo[]> {
    const allRepos: GithubRepo[] = [];

    for (const language of this.languages) {
      const repos = await this.getTrendingRepos(language, 5);
      allRepos.push(...repos);

      // API rate limit対策で少し待機
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // キーワードフィルタリング
    const filtered = allRepos.filter(repo => {
      const descLower = (repo.description || '').toLowerCase();
      const nameLower = repo.name.toLowerCase();

      return keywords.some(keyword =>
        descLower.includes(keyword.toLowerCase()) ||
        nameLower.includes(keyword.toLowerCase()) ||
        repo.topics?.some(topic => topic.toLowerCase().includes(keyword.toLowerCase()))
      );
    });

    return filtered;
  }

  /**
   * 標準化されたフォーマットに変換
   */
  formatRepo(repo: GithubRepo) {
    return {
      id: `github-${repo.id}`,
      title: repo.full_name,
      description: repo.description,
      url: repo.html_url,
      source: 'GitHub',
      language: repo.language,
      stars: repo.stargazers_count,
      timestamp: repo.created_at,
      topics: repo.topics || [],
    };
  }
}
