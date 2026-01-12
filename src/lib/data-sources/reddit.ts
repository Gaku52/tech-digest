import axios from 'axios';

const REDDIT_API_BASE = 'https://www.reddit.com';

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  subreddit: string;
  permalink: string;
  selftext?: string;
}

export class RedditClient {
  private readonly subreddits = [
    'MachineLearning',
    'programming',
    'webdev',
    'reactjs',
    'artificial',
    'LocalLLaMA',
    'typescript',
    'rust'
  ];

  /**
   * 特定のサブレディットのホット投稿を取得
   */
  async getHotPosts(subreddit: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const response = await axios.get(
        `${REDDIT_API_BASE}/r/${subreddit}/hot.json?limit=${limit}`,
        {
          headers: {
            'User-Agent': 'TechDigest/1.0'
          }
        }
      );

      return response.data.data.children.map((child: any) => child.data);
    } catch (error) {
      console.error(`Failed to fetch Reddit posts from r/${subreddit}:`, error);
      return [];
    }
  }

  /**
   * 複数のサブレディットからトレンドを取得
   */
  async getTechTrends(keywords: string[]): Promise<RedditPost[]> {
    const allPosts: RedditPost[] = [];

    for (const subreddit of this.subreddits) {
      const posts = await this.getHotPosts(subreddit, 10);

      // キーワードフィルタリング
      const filtered = posts.filter(post => {
        const titleLower = post.title.toLowerCase();
        const textLower = (post.selftext || '').toLowerCase();

        return keywords.some(keyword =>
          titleLower.includes(keyword.toLowerCase()) ||
          textLower.includes(keyword.toLowerCase())
        );
      });

      allPosts.push(...filtered);
    }

    // スコアでソート
    return allPosts.sort((a, b) => b.score - a.score);
  }

  /**
   * 標準化されたフォーマットに変換
   */
  formatPost(post: RedditPost) {
    return {
      id: `reddit-${post.id}`,
      title: post.title,
      url: post.url.startsWith('http') ? post.url : `https://reddit.com${post.permalink}`,
      source: 'Reddit',
      subreddit: post.subreddit,
      score: post.score,
      author: post.author,
      timestamp: new Date(post.created_utc * 1000).toISOString(),
      comments: post.num_comments,
      text: post.selftext,
    };
  }
}
