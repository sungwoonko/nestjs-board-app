import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';  
import { Board } from './boards.entity';  
import { BoardStatus } from './boards-status.enum';  
import { createBoardDto } from './dto/create-board.dto';  
import { UpdateBoardDto } from './dto/update-board.dto';  

@Injectable()  
export class BoardsService {  
    private boards: Board[] = [];  

    // 모든 게시글 조회 기능  
    getAllBoards(): Board[] {  
        const foundBoards = this.boards; // 모든 게시글을 가져옴  
        if (foundBoards.length === 0) {  
            throw new NotFoundException(`게시글이 없습니다.`); // 게시글 없으면 예외 발생  
        }  
        return foundBoards;  
    }  

    // 특정 게시글 조회 기능  
    getBoardDetailById(id: number): Board {  
        const foundBoard = this.boards.find((board) => board.id == id);  
        if (!foundBoard) {  
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다.`);  
        }  
        return foundBoard;        
    }  

    // 키워드(작성자)로 검색한 게시글 조회 기능  
    getBoardsByKeyword(author: string): Board[] {  
        const foundBoards = this.boards.filter((board) => board.author === author);  
        if (foundBoards.length === 0) {  
            throw new NotFoundException(`작성자 ${author}의 게시글을 찾을 수 없습니다.`);  
        }  
        return foundBoards;  
    }  

    // 게시글 작성 기능
    createBoard(createBoardDto: createBoardDto){
        const {author,title,contents} = createBoardDto;

        // // 유효성 검사  
        if (!author || !title || !contents) {  
            throw new BadRequestException(`작성자, 제목, 그리고 내용을 모두 입력해야 합니다.`);  
        
        }
           
        const board: Board = {
            id: this.boards.length + 1, // 임시 Auto Increament 기능
            author,
            title,
            contents,
            status: BoardStatus.PUBLIC
        }

        const saveBoard = this.boards.push(board);
        return saveBoard;
    } 

    // 특정 번호의 게시글 수정  
    updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Board {  
        const foundBoard = this.getBoardDetailById(id); // 게시글 존재 여부 확인  
        const { title, contents } = updateBoardDto;  
        
        if (!title || !contents) {  
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');  
        }  

        foundBoard.title = title;  
        foundBoard.contents = contents;  

        return foundBoard;  
    } 

    // 특정 번호의 게시글 일부 수정  
    updateBoardStatusById(id: number, status: BoardStatus): Board {  
        const foundBoard = this.getBoardDetailById(id); // 게시글 존재 여부 확인  
        if (!foundBoard) {  
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다. 상태를 수정할 수 없습니다.`);  
        }  

        foundBoard.status = status;  
        return foundBoard;  
    } 

    // 게시글 삭제 기능  
    deleteBoardById(id: number): void {  
        const foundBoard = this.getBoardDetailById(id); // 게시글이 존재하는지 확인  
        if (!foundBoard) {  
            throw new NotFoundException(`ID가 ${id}인 게시글을 찾을 수 없습니다. 삭제할 수 없습니다.`);  
        }  
        this.boards = this.boards.filter((board) => board.id !== foundBoard.id);  
    }  
}




// import { Injectable, NotFoundException } from '@nestjs/common';
// import { Board } from './boards.entity';
// import { BoardStatus } from './boards-status.enum';
// import { createBoardDto } from './dto/create-board.dto';
// import { stat } from 'fs';
// import { UpdateBoardDto } from './dto/update-board.dto';

// @Injectable()
// export class BoardsService {
//     // 데이터베이스
//     private boards: Board[] = [];

//     // 게시글 조회 기능
//     getAllBoards(): Board[] {
//         return this.boards;
//     }

//     // 특정 게시글 조회 기능
//     getBoardDetailById(id: number): Board{
//         const foundBoard = this.boards.find((board) => board.id == id)
//         if (!foundBoard) {
//             throw new NotFoundException(`Board with ID ${id} not found`);
//         }
//         return foundBoard;        
//     }

//     // 키워드(작성자)로 검색한 게시글 조회 기능
//     getBoardsByKeyword(author: string):Board[] {
//         return this.boards.filter((board) => board.author === author);
//     }

//     // 게시글 작성 기능
//     createBoard(createBoardDto: createBoardDto){
//         const {author,title,contents} = createBoardDto;
        
//         const board: Board = {
//             id: this.boards.length + 1, // 임시 Auto Increament 기능
//             author,
//             title,
//             contents,
//             status: BoardStatus.PUBLIC
//         }

//         const saveBoard = this.boards.push(board);
//         return saveBoard;
//     }

//     // 특정 번호의 게시글 수정
//     updateBoardById(id: number,updateBoardDto: UpdateBoardDto): Board{
//         const foundBoard = this.getBoardDetailById(id);
//         const {title,contents} = updateBoardDto;

//         foundBoard.title = title;
//         foundBoard.contents = contents;

//         return foundBoard;
//     }

//     // 특정 번호의 게시글 일부 수정
//     updateBoardStatusById(id: number,status:BoardStatus): Board{
//         const foundBoard = this.getBoardDetailById(id);
//         foundBoard.status = status;
//         return foundBoard;
//     }

//     // 게시글 삭제 기능
//     deleteBoardById(id: number):void{
//         this.boards = this.boards.filter((board) => board.id != id);

//     }
// }

