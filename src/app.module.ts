import { Module } from '@nestjs/common';
import { BoardsModule } from './boards/boards.module';
import { BlogModule } from './blog/blog.module';


@Module({
  imports: [BoardsModule,BlogModule],
  controllers : [],
  providers: [],
})
export class AppModule {}
