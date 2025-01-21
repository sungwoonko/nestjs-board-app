import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './boards.entity';
import { title } from 'process';

@Controller('api/boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService :BoardsService){}
    
    // 게시글 조회 기능 
    @Get('/')
    getAllBoards(): Board[] {
        return this.boardsService.getAllBoards();
    }

    // 게시글 작성 기능
    @Post('/')
    createBoards(
        @Body('author') author: string,
        @Body('title') title: string,
        @Body('contents') contents: string,
    ) {
        return this.boardsService.createBoard(author, title, contents);
    }

}
