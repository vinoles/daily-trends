export interface ScraperPageInterface {
  processPage(): void;
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
