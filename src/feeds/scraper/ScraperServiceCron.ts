import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { ScraperTheCountryPage } from './country-page/ScraperTheCountryPage';
import { ScraperTheWordPage } from './word-page/ScraperTheWordPage';
import puppeteer, { Page } from 'puppeteer';
import { FeedsService } from '../feeds.service';

@Injectable()
export class ScraperServiceCron implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScraperServiceCron.name);
  private cronJob: CronJob;

  constructor(private readonly feedsService: FeedsService) {}

  async onModuleInit() {
    const cronExpression = process.env.INIT_SCRAPER_PAGES || '0 6 * * *';

    this.cronJob = new CronJob(cronExpression, async () => {
      this.logger.debug(
        'Called when the current every 5 minutes or custom schedule',
      );
      this.handleCron();
    });

    this.cronJob.start();
    this.logger.debug(
      `Cron job initialized with expression: ${cronExpression}`,
    );
  }

  onModuleDestroy() {
    if (this.cronJob) {
      this.cronJob.stop();
      this.logger.debug('Cron job stopped');
    }
  }

  async handleCron() {
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

    await scrapeTheCountryPage.processPage();

    const scrapeTheWordPage = new ScraperTheWordPage();
    await scrapeTheWordPage.processPage();
  }
}
