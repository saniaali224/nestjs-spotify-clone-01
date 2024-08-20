/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { createSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Artist } from 'src/artists/artists-entity';

@Injectable()
export class SongsService {
  constructor(
    @InjectRepository(Song)
    private songsRepository: Repository<Song>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  async paginate(options: IPaginationOptions): Promise<Pagination<Song>> {
    const queryBuilder = this.songsRepository.createQueryBuilder('c');
    queryBuilder.orderBy('c.releaseDate', 'DESC');
    return paginate<Song>(queryBuilder, options);
  }

  async create(songDto: createSongDto): Promise<Song> {
    const song = new Song();
    song.title = songDto.title;
    song.duration = songDto.duration;
    song.lyrics = songDto.lyrics;
    song.releaseDate = songDto.releaseDate;

    // Find the artists based on the provided IDs
    const artists = await this.artistRepository.find({
      where: {
        id: In(songDto.artists),
      },
    });

    if (!artists || artists.length === 0) {
      throw new Error('Artists not found');
    }

    // Assign the artist entities to the song
    song.artists = artists;

    return this.songsRepository.save(song);
  }

  findAll() {
    return this.songsRepository.find();
  }
  findOne(id: number): Promise<Song> {
    return this.songsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.songsRepository.delete(id);
  }

  async updateSong(
    id: number,
    recordToUpdate: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsRepository.update(id, recordToUpdate);
  }
}
