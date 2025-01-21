import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    // 생성자 주입
    constructor(private boardsService :BoardsService){}
    
    @Get('hello')
    async getHello(): Promise<string>{
        return this.boardsService.hello();
    }

}
