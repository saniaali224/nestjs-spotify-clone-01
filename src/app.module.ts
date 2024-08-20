/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/logger.middleware';
import { AppService } from './app.service';
import { SongsModule } from './songs/songs.module';
import { SongsController } from './songs/songs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Song } from './songs/song.entity';
import { Artist } from './artists/artists-entity';
import { User } from './users/user-entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [
    SongsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'testDB', // enter ur db name here
      host: 'localhost',
      port: 5432,
      username: 'postgres', //enter ur user name here
      password: '', //enter your password here
      entities: [Song, Artist, User],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ArtistsModule,
  ],
  controllers: [AppController], // Keep only necessary controllers here
  providers: [AppService], // Removed ArtistsService since it's already provided by ArtistsModule
})
export class AppModule implements NestModule {
  constructor(private datasource: DataSource) {
    console.log('Connected to database:', datasource.options.database);
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(SongsController); // Apply middleware to SongsController
  }
}
