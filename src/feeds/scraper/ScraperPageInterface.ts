import { Page } from 'puppeteer';

export interface ScraperPageInterface {
  processPage(): void;
  extractArticleContent(detailPage: Page): Promise<Object>;
}
export interface CategoryPage {
  categoryPage: string;
}

export interface PageArticle {
  title: string;
  url: string;
  category: string;
  baseUrl: string;
}
