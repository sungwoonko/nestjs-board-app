import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlogService } from './blog.service';
import { Blog } from './blog.entity';
import { title } from 'process';
import { createBlogDto } from './dto/create-blog.dto';
import { BlogStatus } from './blog-status.enum';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogStatusValidationPipe } from './pipes/blog-status-validation.pipe';

@Controller('api/blog')
@UsePipes(ValidationPipe)
export class BlogController {
    // 생성자 주입
    constructor(private blogService :BlogService){}
    
    // 블로그  조회 기능 
    @Get('/')
    getAllBlogs(): Blog[] {
        return this.blogService.getAllBlogs();
    }


    // 특정 블로그 조회 기능 
    @Get('/:id')
    getBlogDetailById(@Param('id')id: number): Blog {
        return this.blogService.getBlogDetailById(id);
    }

    // 키워드(작성자)로 검색한 블로그 조회 기능
    @Get('/search/:keyword')
    getBlogsByKeyword(@Query('author')author: string): Blog[] {
        return this.blogService.getBlogsByKeyword(author);
    }


    // 블로그 작성 기능
    @Post('/')
    createBlogs(@Body() createBlogDto: createBlogDto) {
        return this.blogService.createBlog(createBlogDto);
    }

    // 특정 번호의 블로그 수정
    @Put('/:id')
    updateBlogById(
        @Param('id')id: number,
        @Body() updateBlogDto: UpdateBlogDto): Blog{
        return this.blogService.updateBlogById(id,updateBlogDto)

    }

    // 특정 번호의 블로그 일부 수정
    @Patch('/:id')
    updateBlogStatusById(
        @Param('id') id: number,
        @Body('status', BlogStatusValidationPipe )status: BlogStatus): Blog{
        return this.blogService.updateBlogStatusById(id,status);
    }


    // 블로그 삭제 기능
    @Delete('/:id')
    deleteBlogById(@Param('id')id: number): void {
        this.blogService.deleteBlogById(id);
    }

}
