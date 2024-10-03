import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedDto } from './dto/create-feed.dto';
import { EnumFeed, Feed } from './schemas/feed.schema';
import { UpdateFeedDto } from './dto/update-feed.dto';

@Injectable()
export class FeedsService {
  /**
   * Constructor to inject the Feed model.
   *
   * @param {Model<Feed>} feedModel
   */
  constructor(
    @InjectModel(Feed.name) private readonly feedModel: Model<Feed>,
  ) {}

  /**
   * Creates a new feed and saves it to the database.
   *
   * @param {CreateFeedDto} createFeedDto
   * @return {Promise<Feed>}
   */
  async create(createFeedDto: CreateFeedDto): Promise<Feed> {
    const publishedAt = new Date().toISOString();
    const feedData = { ...createFeedDto, publishedAt };
    const createdFeed = await this.feedModel.create(feedData);
    return createdFeed;
  }

  /**
   * Retrieves all feeds stored in the database.
   *
   * @param {number} lpage
   * @param {number} limit
   * @param {EnumFeed} origin
   * @param {string} category
   * @param {string} sortField
   * @param {string} sortOrder
   * @return {Promise<Feed>}
   */
  async findAll(
    page: number,
    limit: number,
    origin?: EnumFeed,
    category?: string,
    sortField: string = 'publishedAt',
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<{ data: Feed[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (origin) {
      filter.origin = origin;
    }

    if (category) {
      filter.category = category;
    }

    const sort: { [key: string]: 1 | -1 } = {
      [sortField]: sortOrder === 'asc' ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      this.feedModel.find(filter).skip(skip).limit(limit).sort(sort).exec(),
      this.feedModel.countDocuments(filter).exec(),
    ]);

    return { data, total };
  }

  /**
   * Retrieves all feeds stored in the database grouped by origin, with a limit
   * applied per group category.
   *
   * @param {number} limit
   * @param {EnumFeed} origin
   * @param {string} sortOrder
   *
   * @return {Promise<any>}
   */
  async findAllGroupedByOrigin(
    limit: number = 5,
    origin?: EnumFeed,
    sortOrder: 'asc' | 'desc' = 'desc',
  ): Promise<any> {
    const sortField: string = 'publishedAt';

    limit = Number(limit);

    const filter: any = {};
    if (origin) {
      filter.origin = origin;
    }

    const sort: any = {};
    sort[sortField] = sortOrder === 'asc' ? 1 : -1;

    const pipelineObject = [
      { $match: filter },
      {
        $group: {
          _id: { origin: '$origin', category: '$category' },
          feeds: {
            $push: '$$ROOT',
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          origin: '$_id.origin',
          category: '$_id.category',
          feeds: { $slice: ['$feeds', limit] },
          total: 1,
        },
      },
      {
        $group: {
          _id: '$origin',
          categories: {
            $push: {
              category: '$category',
              feeds: '$feeds',
              total: '$total',
            },
          },
        },
      },
      { $sort: { _id: sort[sortField] } },
    ];

    const data = await this.feedModel.aggregate(pipelineObject).exec();

    return data;
  }

  /**
   * Retrieves a feed by its ID.
   *
   * @param {string} id
   * @return {Promise<Feed | null>}
   */
  async findOne(id: string): Promise<Feed | null> {
    try {
      return await this.feedModel.findOne({ _id: id }).exec();
    } catch (error) {
      console.error(`Error retrieving the feed with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Updates an existing feed in the database by its ID.
   *
   * @param {string} id
   * @param {UpdateFeedDto} updateFeedDto
   * @return {Promise<Feed | null>}
   */
  async update(id: string, updateFeedDto: UpdateFeedDto): Promise<Feed | null> {
    const updatedAt = new Date().toISOString();
    const feedData = { ...updateFeedDto, updatedAt };
    try {
      return await this.feedModel
        .findByIdAndUpdate(id, feedData, { new: true })
        .exec();
    } catch (error) {
      console.error(`Error updating the feed with ID ${id}:`, error);
      return null;
    }
  }

  /**
   * Deletes a feed from the database by its ID.
   *
   * @param {string} id
   *
   * @return {Promise<Feed | null>}
   */
  async delete(id: string): Promise<Feed | null> {
    try {
      return await this.feedModel.findByIdAndDelete({ _id: id }).exec();
    } catch (error) {
      console.error(`Error deleting the feed with ID ${id}:`, error);
      return null;
    }
  }
}
