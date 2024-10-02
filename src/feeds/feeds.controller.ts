import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Feed, FeedSchema } from './schemas/feed.schema';

@Controller('feeds')
@ApiTags('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new feed' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The feed has been successfully created.',
    type: Feed, // Specify the response type here
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input.',
  })
  create(@Body() createFeedDto: CreateFeedDto) {
    return this.feedsService.create(createFeedDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all feeds' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a list of all feeds.',
    type: [Feed], // Array of Feed objects
  })
  findAll() {
    return this.feedsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a feed by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The feed with the specified ID.',
    type: Feed, // Specify the response type here
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feed not found.',
  })
  findOne(@Param('id') id: string) {
    return this.feedsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing feed' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The updated feed.',
    type: Feed, // Specify the response type here
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Feed not found.',
  })
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedsService.update(id, updateFeedDto);
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
  remove(@Param('id') id: string) {
    return this.feedsService.delete(id);
  }
}
