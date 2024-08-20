/* eslint-disable prettier/prettier */
import { Artist } from 'src/artists/artists-entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToMany(() => Artist, (artist) => artist.song, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  @Column('date')
  releaseDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;
}
