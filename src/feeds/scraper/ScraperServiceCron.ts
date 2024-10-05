import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ScraperTheCountryPage } from './country-page/ScraperTheCountryPage';
import { ScraperTheWordPage } from './word-page/ScraperTheWordPage';
import puppeteer, { Page } from 'puppeteer';
import { FeedsService } from '../feeds.service';

@Injectable()
export class ScraperServiceCron {
  constructor(private readonly feedsService: FeedsService) {}
  private readonly logger = new Logger(ScraperServiceCron.name);

  // @Cron('*/5 * * * *')
  @Cron('25 12 * * *')
  async handleCron() {
    this.logger.debug('Called when the current every 5 minutes');
    const excludeSectionsCountryPage: string[] = [
      'portada_cross-linking',
      'portada_tematicos_pasatiempos-en-el-pais',
      'portada_tematicos_el-pais-expres',
      '',
    ];

    const [width, height] = [1920, 1080];

    const agent: string =
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

    const countryBrowser = await puppeteer.launch({
      headless: true,
      timeout: 10000,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    const countryPage: Page = await countryBrowser.newPage();

    await countryPage.setViewport({ width, height });

    const scrapeTheCountryPage = new ScraperTheCountryPage(
      countryBrowser,
      countryPage,
      agent,
      excludeSectionsCountryPage,
      this.feedsService,
    );

    scrapeTheCountryPage.processPage();

    const scrapeTheWordPage = new ScraperTheWordPage();
    scrapeTheWordPage.processPage();
  }
}
