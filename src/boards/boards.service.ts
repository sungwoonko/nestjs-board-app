import { Injectable,BadRequestException, NotFoundException } from '@nestjs/common';  
import { Board } from './boards.entity';  
import { BoardStatus } from './boards-status.enum';  
import { createBoardDto } from './dto/create-board.dto';  
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';


@Injectable()  
export class BoardsService { 
    // Repository 계층 DI 
    constructor(
        @InjectRepository(Board)
        private boardRepository: Repository<Board>
    ){}

    // 모든 게시글 조회 기능  
    async getAllBoards(): Promise<Board[]> {  
        const foundBoards = await this.boardRepository.find(); // 모든 게시글을 가져옴  
        return foundBoards;  
    }  

    // 특정 게시글 조회 기능  
    async getBoardDetailById(id: number): Promise<Board> {
        const foundBoard = await this.boardRepository.findOneBy({id: id});  
        if (!foundBoard) {  
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);  
        }  
        return foundBoard;        
    }  

    // 키워드(작성자)로 검색한 게시글 조회 기능  
    async getBoardsByKeyword(author: string): Promise<Board[]> {  
        const foundBoards = await this.boardRepository.findBy({author: author});  
        if (foundBoards.length === 0) {  
            throw new NotFoundException(`작성자 ${author}의 게시글을 찾을 수 없습니다.`);  
        }  
        return foundBoards;  
    }  

    // 게시글 작성 기능
    async createBoard(createBoardDto: createBoardDto):Promise<Board>{
        const {author,title,contents} = createBoardDto;

        // // 유효성 검사  
        if (!author || !title || !contents) {  
            throw new BadRequestException(`작성자, 제목, 그리고 내용을 모두 입력해야 합니다.`);  
        }
        const newboard: Board = {
            id: 0, // 임시 초기화
            author, // author : createBoardDto.author
            title,
            contents,
            status: BoardStatus.PUBLIC
        }
        const createBoard = await this.boardRepository.save(newboard);
        return createBoard;
    } 

    // 특정 번호의 게시글 수정  
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<Board> {  
        const foundBoard = await this.getBoardDetailById(id); // 게시글 존재 여부 확인  
        const { title, contents } = updateBoardDto;  
        if (!title || !contents) {  
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');  
        }  
        foundBoard.title = title;  
        foundBoard.contents = contents;  
        const updatedBoard = await this.boardRepository.save(foundBoard); 
        return updatedBoard;  
    } 

    // 특정 번호의 게시글 일부 수정  
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {  
        const result = await this.boardRepository.update(id,{ status }); // 게시글 존재 여부 확인  
        if (result.affected === 0) {  
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다. 상태를 수정할 수 없습니다.`);  
        }  
  
    } 

    // 게시글 삭제 기능  
    async deleteBoardById(id: number): Promise<void> {  
        const foundBoard = await this.getBoardDetailById(id); // 게시글이 존재하는지 확인  
        await this.boardRepository.delete(foundBoard);  
    }  
}

