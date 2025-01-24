import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';



@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    BoardsModule,
    BlogModule
  ],
})
export class AppModule {}
