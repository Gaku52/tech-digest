import cron from 'node-cron';
import { HackerNewsClient } from '../data-sources/hacker-news';
import { RedditClient } from '../data-sources/reddit';
import { GithubClient } from '../data-sources/github';
import { keywordManager } from '../keyword-manager';

export interface TrendItem {
  id: string;
  title: string;
  url: string;
  source: string;
  score: number;
  timestamp: string;
  keywords_score: number;
  [key: string]: any;
}

export class DailyFetchScheduler {
  private hnClient = new HackerNewsClient();
  private redditClient = new RedditClient();
  private githubClient = new GithubClient();
  private isRunning = false;

  /**
   * 全データソースから情報を取得
   */
  async fetchAllTrends(): Promise<TrendItem[]> {
    console.log('[TechDigest] Starting daily trend fetch...');

    const keywords = keywordManager.getImportantKeywords();
    const allTrends: TrendItem[] = [];

    try {
      // Hacker News
      console.log('[HackerNews] Fetching trends...');
      const hnStories = await this.hnClient.getTechTrends(keywords, 50);
      const hnFormatted = hnStories.map(story => ({
        ...this.hnClient.formatStory(story),
        keywords_score: keywordManager.calculateScore(story.title),
      }));
      allTrends.push(...hnFormatted);
      console.log(`[HackerNews] Found ${hnFormatted.length} trends`);

      // Reddit
      console.log('[Reddit] Fetching trends...');
      const redditPosts = await this.redditClient.getTechTrends(keywords);
      const redditFormatted = redditPosts.map(post => ({
        ...this.redditClient.formatPost(post),
        keywords_score: keywordManager.calculateScore(post.title + ' ' + (post.selftext || '')),
      }));
      allTrends.push(...redditFormatted);
      console.log(`[Reddit] Found ${redditFormatted.length} trends`);

      // GitHub
      console.log('[GitHub] Fetching trends...');
      const githubRepos = await this.githubClient.getTechTrends(keywords);
      const githubFormatted = githubRepos.map(repo => ({
        ...this.githubClient.formatRepo(repo),
        score: repo.stargazers_count,
        keywords_score: keywordManager.calculateScore(
          repo.name + ' ' + (repo.description || '') + ' ' + (repo.topics?.join(' ') || '')
        ),
      }));
      allTrends.push(...githubFormatted);
      console.log(`[GitHub] Found ${githubFormatted.length} trends`);

      // スコアでソート
      const sorted = allTrends.sort((a, b) => b.keywords_score - a.keywords_score);

      console.log(`[TechDigest] Total trends fetched: ${sorted.length}`);
      return sorted;

    } catch (error) {
      console.error('[TechDigest] Error fetching trends:', error);
      throw error;
    }
  }

  /**
   * 1日1回のスケジュール実行 (毎朝6時)
   */
  startDailySchedule(callback?: (trends: TrendItem[]) => void) {
    if (this.isRunning) {
      console.log('[Scheduler] Already running');
      return;
    }

    console.log('[Scheduler] Starting daily schedule (06:00 JST)');

    // 毎日6時に実行
    cron.schedule('0 6 * * *', async () => {
      try {
        console.log('[Scheduler] Running scheduled fetch...');
        const trends = await this.fetchAllTrends();

        if (callback) {
          callback(trends);
        }

        // ここでデータベースに保存する処理を追加予定
        console.log('[Scheduler] Fetch completed successfully');
      } catch (error) {
        console.error('[Scheduler] Scheduled fetch failed:', error);
      }
    });

    this.isRunning = true;
    console.log('[Scheduler] Daily schedule started');
  }

  /**
   * テスト用: 即座に実行
   */
  async runOnce(callback?: (trends: TrendItem[]) => void) {
    console.log('[Scheduler] Running one-time fetch...');
    const trends = await this.fetchAllTrends();

    if (callback) {
      callback(trends);
    }

    return trends;
  }

  /**
   * スケジューラーを停止
   */
  stop() {
    this.isRunning = false;
    console.log('[Scheduler] Stopped');
  }
}

export const scheduler = new DailyFetchScheduler();
