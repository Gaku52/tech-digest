import axios from 'axios';

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0';

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  text?: string;
}

export class HackerNewsClient {
  /**
   * トップストーリーのIDリストを取得
   */
  async getTopStories(limit: number = 30): Promise<number[]> {
    try {
      const response = await axios.get(`${HN_API_BASE}/topstories.json`);
      return response.data.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch HN top stories:', error);
      throw error;
    }
  }

  /**
   * 特定のストーリーの詳細を取得
   */
  async getStory(id: number): Promise<HNStory | null> {
    try {
      const response = await axios.get(`${HN_API_BASE}/item/${id}.json`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch HN story ${id}:`, error);
      return null;
    }
  }

  /**
   * キーワードマッチングでフィルタリング
   */
  async getTechTrends(keywords: string[], limit: number = 30): Promise<HNStory[]> {
    const storyIds = await this.getTopStories(limit);
    const stories: HNStory[] = [];

    for (const id of storyIds) {
      const story = await this.getStory(id);
      if (!story) continue;

      // キーワードマッチング
      const titleLower = story.title.toLowerCase();
      const hasKeyword = keywords.some(keyword =>
        titleLower.includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        stories.push(story);
      }
    }

    return stories;
  }

  /**
   * 標準化されたフォーマットに変換
   */
  formatStory(story: HNStory) {
    return {
      id: `hn-${story.id}`,
      title: story.title,
      url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
      source: 'Hacker News',
      score: story.score,
      author: story.by,
      timestamp: new Date(story.time * 1000).toISOString(),
      comments: story.descendants || 0,
    };
  }
}
