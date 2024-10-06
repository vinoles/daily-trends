import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { ScraperTheCountryPage } from './country-page/ScraperTheCountryPage';
import { ScraperTheWordPage } from './word-page/ScraperTheWordPage';
import puppeteer, { Page, PuppeteerLaunchOptions } from 'puppeteer';
import { FeedsService } from '../feeds.service';

@Injectable()
export class ScraperServiceCron implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScraperServiceCron.name);
  private cronJob: CronJob;
  private agent: string =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  private launchOptions: PuppeteerLaunchOptions = {
    executablePath: process.env.GOOGLE_CHROME_BIN,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    timeout: 20000,
    protocolTimeout: 40000,
  };

  constructor(private readonly feedsService: FeedsService) {}

  async onModuleInit() {
    const cronExpression = process.env.INIT_SCRAPER_PAGES || '0 6 * * *';

    this.cronJob = new CronJob(cronExpression, async () => {
      this.handleCron();
    });

    this.cronJob.start();

    this.logger.debug(
      `Cron job initialized with expression : ${cronExpression}`,
    );
  }

  onModuleDestroy() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.logger.debug('Cron job stopped');
    }
  }

  async handleCron() {
    this.logger.debug(`Cron job initialized`);
    this.runTheCountryPageScrape();
    this.runTheWordPageScrape();
  }

  async runTheCountryPageScrape() {
    const excludeSectionsPage: string[] = [
      'portada_cross-linking',
      'portada_tematicos_pasatiempos-en-el-pais',
      'portada_tematicos_el-pais-expres',
      '',
    ];

    const [width, height] = [1920, 1080];
    puppeteer.executablePath();
    const browser = await puppeteer.launch(this.launchOptions);

    const page: Page = await browser.newPage();

    await page.setViewport({ width, height });

    const scrapeTheCountryPage = new ScraperTheCountryPage(
      browser,
      page,
      this.agent,
      excludeSectionsPage,
      this.feedsService,
    );

    await scrapeTheCountryPage.processPage();
  }

  async runTheWordPageScrape() {
    const excludeSectionsPage: string[] = ['autor', ''];

    const [width, height] = [1920, 1080];

    const browser = await puppeteer.launch(this.launchOptions);

    const page: Page = await browser.newPage();

    await page.setViewport({ width, height });

    const scrapeTheWordPage = new ScraperTheWordPage(
      browser,
      page,
      this.agent,
      excludeSectionsPage,
      this.feedsService,
    );

    await scrapeTheWordPage.processPage();
  }
}
