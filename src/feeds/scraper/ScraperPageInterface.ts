import { Page } from 'puppeteer';

export interface ScraperPageInterface {
  processPage(): void;
  extractArticleContent(detailPage: Page): Promise<Object>;
}
export interface CategoryPage {
  categoryPage: string;
}

export interface PageCountryArticle {
  title: string;
  url: string;
}

export interface CategoryPageCountryArticles {
  categoryPage: string;
  articles: PageCountryArticle[];
}

export interface PageArticle {
  title: string;
  url: string;
  category: string;
  baseUrl: string;
}
