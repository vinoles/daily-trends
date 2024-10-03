import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  Res,
  HttpException,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { EnumFeed } from './schemas/feed.schema';
import { Response } from 'express';
import { FeedResponseDto, FeedResponseListDto } from 'src/interfaces';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feed' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The feed has been successfully created.',
    type: FeedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while creating the feed.',
  })

  /**
   * Creates a new feed and saves it to the database.
   *
   * @param {CreateFeedDto} createFeedDto
   * @param {Response} res
   * @return {Promise<Response>}
   */
  async create(
    @Body() createFeedDto: CreateFeedDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const newFeed = await this.feedsService.create(createFeedDto);
      return res
        .status(HttpStatus.CREATED)
        .json({ status: 'success', data: newFeed });
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'error', message: error.message });
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'An error occurred while creating the feed.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all feeds grouped by origin',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feeds have been successfully retrieved.',
    type: FeedResponseListDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input parameters.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while retrieving the feeds.',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    example: 1,
    description: 'Number of page',
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    example: 10,
    description: 'Number of feeds per page',
  })
  @ApiQuery({
    name: 'origin',
    required: false,
    enum: EnumFeed,
    description: 'Filter by feed origin',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    example: 'technology',
    description: 'category',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Order of sorting',
  })
  @ApiQuery({
    name: 'sortField',
    required: false,
    example: 'publishedAt',
    description: 'Field order of sorting',
  })

  /**
   * Retrieves all feeds stored in the database grouped by origin, with a limit applied per group.
   *
   * @param {number} page
   * @param {number} limit
   * @param {EnumFeed} origin
   * @param {string} category
   * @param {string} sortField
   * @param {string} sortOrder
   * @param {Response} res
   *
   * @return {Promise<Response>}
   */
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Res() res: Response,
    @Query('origin') origin?: EnumFeed,
    @Query('category') category?: string,
    @Query('sortField') sortField?: string,
  ): Promise<Response> {
    try {
      const data = await this.feedsService.findAll(
        page,
        limit,
        origin,
        category,
        sortField,
        sortOrder,
      );

      return res.status(HttpStatus.OK).json({ status: 'success', data });
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'error', message: error.message });
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'An error occurred while retrieving the feeds.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/grouped-by-origin')
  @ApiOperation({
    summary: 'Retrieve all feeds grouped by origin and category',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a grouped list of feeds by origin.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input parameters.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while retrieving the feeds.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 5,
    description: 'Number of feeds per page',
  })
  @ApiQuery({
    name: 'origin',
    required: false,
    enum: EnumFeed,
    description: 'Filter by feed origin',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
    description: 'Order of sorting',
  })

  /**
   * Retrieves all feeds stored in the database grouped by origin, with a limit applied per group.
   *
   * @param {number} limit
   * @param {EnumFeed} origin
   * @param {string} sortOrder
   * @param {Response} res
   *
   * @return {Promise<Response>}
   */
  async findAllGroupedByOrigin(
    @Query('limit') limit: number = 5,
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Res() res: Response,
    @Query('origin') origin?: EnumFeed,
  ): Promise<Response> {
    try {
      const data = await this.feedsService.findAllGroupedByOrigin(
        limit,
        origin,
        sortOrder,
      );

      return res.status(HttpStatus.OK).json({ status: 'success', data });
    } catch (error) {
      if (error.status === HttpStatus.BAD_REQUEST) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ status: 'error', message: error.message });
      }

      throw new HttpException(
        {
          status: 'error',
          message: 'An error occurred while retrieving the feeds.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a feed by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feed with the specified ID.',
    type: FeedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feed not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while retrieving the feed.',
  })

  /**
   * Retrieves a feed from the database by its ID.
   *
   * @param {string} id
   * @param {Response} res
   * @return {Promise<Response>}
   */
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const feed = await this.feedsService.findOne(id);
      if (!feed) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ status: 'error', message: 'Feed not found.' });
      }

      return res.status(HttpStatus.OK).json({ status: 'success', data: feed });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing feed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The updated feed.',
    type: FeedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feed not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while updating the feed.',
  })

  /**
   * Updates an existing feed in the database by its ID.
   *
   * @param {string} id
   * @param {UpdateFeedDto} updateFeedDto
   * @param {Response} res
   * @return {Promise<Response>}
   */
  async update(
    @Param('id') id: string,
    @Body() updateFeedDto: UpdateFeedDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const updatedFeed = await this.feedsService.update(id, updateFeedDto);
      if (!updatedFeed) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ status: 'error', message: 'Feed not found.' });
      }

      const response = { status: 'success', data: updatedFeed };
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a feed by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feed has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feed not found.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'An error occurred while deleting the feed.',
  })

  /**
   * Deletes a feed from the database by its ID.
   *
   * @param {string} id
   * @return {Promise<Response> }
   */
  async remove(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const result = await this.feedsService.delete(id);
      if (!result) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ status: false, message: 'Feed not found.' });
      }

      return res.status(HttpStatus.OK).json({ status: true });
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
