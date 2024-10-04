import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { EnumOrigin, Feed } from '../schemas/feed.schema';
import { CreateFeedDto } from '../dto/create-feed.dto';
import { UpdateFeedDto } from '../dto/update-feed.dto';
const _ = require('lodash');

/**
 * Service class for generating fake feeds for testing purposes.
 * This class provides methods to create individual feeds or arrays of feeds
 * with randomized data for various categories and origins.
 */
@Injectable()
export class FakeFeedService {
  categories: string[] = ['technology', 'sport', 'finance'];

  origins: EnumOrigin[] = [
    EnumOrigin.COUNTRY_PAGE,
    EnumOrigin.LOCAL_PAGE,
    EnumOrigin.WORD_PAGE,
  ];

  /**
   * Creates a single fake feed with random data.
   *
   * @returns {Feed}
   */
  createFakeFeed(): Feed {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: _.sample(this.categories),
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: _.sample(this.origins),
      content: faker.lorem.paragraph(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Creates a single fake feed with random data.
   *
   * @returns {CreateFeedDto}
   */
  createFakeFeedDto(): CreateFeedDto {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: _.sample(this.categories),
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: _.sample(this.origins),
      content: faker.lorem.paragraph(),
    };
  }

  /**
   * Creates a single fake feed with random data.
   *
   * @returns {UpdateFeedDto}
   */
  updateFakeFeedDto(): UpdateFeedDto {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: _.sample(this.categories),
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: _.sample(this.origins),
      content: faker.lorem.paragraph(),
    };
  }

  /**
   * Creates an array of fake feeds.
   *
   * @param {number} count
   * @returns {Feed[]}
   */
  createFakeFeeds(total: number): Feed[] {
    return Array.from({ length: total }, () => this.createFakeFeed());
  }

  /**
   * Creates a single fake feed based on a specified category and origin.
   *
   * @param {string} category
   * @param {EnumOrigin} origin
   * @returns {Feed}
   */
  createFakeFeedByOriginAndCategory(
    category: string,
    origin: EnumOrigin,
  ): Feed {
    return {
      title: faker.lorem.sentence(),
      subtitle: faker.lorem.sentence(),
      category: category,
      url: faker.internet.url(),
      urlImage: faker.internet.url(),
      author: faker.person.firstName(),
      origin: origin,
      content: faker.lorem.paragraph(),
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Creates an array of fake feeds based on a specified category and origin.
   *
   * @param {number} total
   * @param {string} category
   * @param {EnumOrigin} origin
   * @returns {Feed[]}
   */
  createFakeFeedsByOriginAndCategory(
    total: number,
    category: string,
    origin: EnumOrigin,
  ): Feed[] {
    return Array.from({ length: total }, () =>
      this.createFakeFeedByOriginAndCategory(category, origin),
    );
  }
}
