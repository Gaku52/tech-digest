import keywordsData from '../../config/keywords.json';

export interface KeywordCategory {
  priority: 'critical' | 'high' | 'medium' | 'low';
  terms: string[];
  updateFrequency: string;
}

export class KeywordManager {
  private keywords: typeof keywordsData;

  constructor() {
    this.keywords = keywordsData;
  }

  /**
   * 全てのキーワードを優先度順に取得
   */
  getAllKeywords(): string[] {
    const allTerms: string[] = [];

    Object.values(this.keywords.keywords).forEach(category => {
      allTerms.push(...category.terms);
    });

    return [...new Set(allTerms)]; // 重複削除
  }

  /**
   * 優先度別にキーワードを取得
   */
  getKeywordsByPriority(priority: 'critical' | 'high' | 'medium' | 'low'): string[] {
    const terms: string[] = [];

    Object.values(this.keywords.keywords).forEach(category => {
      if (category.priority === priority) {
        terms.push(...category.terms);
      }
    });

    return terms;
  }

  /**
   * 重要キーワード(critical + high)のみ取得
   */
  getImportantKeywords(): string[] {
    return [
      ...this.getKeywordsByPriority('critical'),
      ...this.getKeywordsByPriority('high'),
    ];
  }

  /**
   * インフルエンサーアカウントリストを取得
   */
  getInfluencers(): string[] {
    return this.keywords.influencers.accounts;
  }

  /**
   * テキストがキーワードにマッチするかチェック
   */
  matchesKeywords(text: string, minPriority: 'critical' | 'high' | 'medium' | 'low' = 'medium'): boolean {
    const textLower = text.toLowerCase();
    const keywords = this.getKeywordsByPriorityLevel(minPriority);

    return keywords.some(keyword => textLower.includes(keyword.toLowerCase()));
  }

  /**
   * 優先度レベル以上のキーワードを取得
   */
  private getKeywordsByPriorityLevel(minPriority: string): string[] {
    const priorities: { [key: string]: number } = {
      'critical': 4,
      'high': 3,
      'medium': 2,
      'low': 1,
    };

    const minLevel = priorities[minPriority] || 2;
    const terms: string[] = [];

    Object.values(this.keywords.keywords).forEach(category => {
      const categoryLevel = priorities[category.priority] || 1;
      if (categoryLevel >= minLevel) {
        terms.push(...category.terms);
      }
    });

    return [...new Set(terms)];
  }

  /**
   * スコアリング: テキスト内のキーワードマッチ数と優先度で計算
   */
  calculateScore(text: string): number {
    const textLower = text.toLowerCase();
    let score = 0;

    const priorityScores: Record<'critical' | 'high' | 'medium' | 'low', number> = {
      'critical': 10,
      'high': 5,
      'medium': 2,
      'low': 1,
    };

    Object.values(this.keywords.keywords).forEach(category => {
      category.terms.forEach(term => {
        if (textLower.includes(term.toLowerCase())) {
          score += priorityScores[category.priority as keyof typeof priorityScores] || 1;
        }
      });
    });

    return score;
  }
}

export const keywordManager = new KeywordManager();
