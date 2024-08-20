/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { SongsService } from './songs.service';
import { createSongDto } from './dto/create-song.dto';
import { Song } from './song.entity';
import { UpdateSongDto } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/auth/jwtauthguardArtist';

// import { DeleteResult } from 'typeorm/driver/mongodb/typings';
//import { Connection } from 'src/common/constant/connection';

@Controller('songs')
export class SongsController {
  constructor(
    private readonly songsService: SongsService,
    // @Inject('CONNECTION') private connection: Connection,
  ) {
    // console.log(this.connection);
  } // Inject SongsService

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return this.songsService.paginate({
      limit,
      page,
    });
  }
  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.songsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDTO: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.updateSong(id, updateSongDTO);
  }

  @Delete(':id')
  deleteSong(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }
  @Post()
  @UseGuards(ArtistJwtGuard)
  createSong(
    @Body() createSong: createSongDto,
    @Request() request,
  ): Promise<Song> {
    console.log(request.user);

    return this.songsService.create(createSong);
  }
}
