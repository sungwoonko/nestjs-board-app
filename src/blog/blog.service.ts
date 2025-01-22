import { Injectable, NotFoundException,BadRequestException } from '@nestjs/common';  
import { Blog } from './blog.entity';  
import { BlogStatus } from './blog-status.enum';  
import { createBlogDto } from './dto/create-blog.dto';  
import { UpdateBlogDto } from './dto/update-blog.dto';  

@Injectable()  
export class BlogService {  
    private blogs: Blog[] = [];  

    // 모든 블로그 조회 기능  
    getAllBlogs(): Blog[] {  
        const foundBlogs = this.blogs; // 모든 블로그를 가져옴  
        if (foundBlogs.length === 0) {  
            throw new NotFoundException(`블로그가 없습니다.`); // 블로그가 없으면 예외 발생  
        }  
        return foundBlogs;  
    }  

    // 특정 블로그 조회 기능  
    getBlogDetailById(id: number): Blog {  
        const foundBlog = this.blogs.find((blog) => blog.id == id);  
        if (!foundBlog) {  
            throw new NotFoundException(`ID가 ${id}인 블로그를 찾을 수 없습니다.`);  
        }  
        return foundBlog;        
    }  

    // 키워드(작성자)로 검색한 블로그 조회 기능  
    getBlogsByKeyword(author: string): Blog[] {  
        const foundBlogs = this.blogs.filter((blog) => blog.author === author);  
        if (foundBlogs.length === 0) {  
            throw new NotFoundException(`작성자 ${author}의 블로그를 찾을 수 없습니다.`);  
        }  
        return foundBlogs;  
    }  

    // 게시글 작성 기능
    createBlog(createBlogDto: createBlogDto){
        const {author,title,contents} = createBlogDto;

        // // 유효성 검사  
        if (!author || !title || !contents) {  
            throw new BadRequestException(`작성자, 제목, 그리고 내용을 모두 입력해야 합니다.`);  
        
        }
           
        const blog: Blog = {
            id: this.blogs.length + 1, // 임시 Auto Increament 기능
            author,
            title,
            contents,
            status: BlogStatus.PUBLIC
        }

        const saveBlog = this.blogs.push(blog);
        return saveBlog;
    } 

    // 특정 번호의 블로그 수정  
    updateBlogById(id: number, updateBlogDto: UpdateBlogDto): Blog {  
        const foundBlog = this.getBlogDetailById(id); // 블로그 존재 여부 확인  
        const { title, contents } = updateBlogDto;  
        
        if (!title || !contents) {  
            throw new BadRequestException('제목과 내용을 모두 입력해야 합니다.');  
        }  

        foundBlog.title = title;  
        foundBlog.contents = contents;  

        return foundBlog;  
    } 

    // 특정 번호의 블로그 일부 수정  
    updateBlogStatusById(id: number, status: BlogStatus): Blog {  
        const foundBlog = this.getBlogDetailById(id); // 블로그 존재 여부 확인  
        if (!foundBlog) {  
            throw new NotFoundException(`ID가 ${id}인 블로그를 찾을 수 없습니다. 상태를 수정할 수 없습니다.`);  
        }  

        foundBlog.status = status;  
        return foundBlog;  
    } 

    // 블로그 삭제 기능  
    deleteBlogById(id: number): void {  
        const foundBlog = this.getBlogDetailById(id); // 블로그가 존재하는지 확인  
        if (!foundBlog) {  
            throw new NotFoundException(`ID가 ${id}인 블로그를 찾을 수 없습니다. 삭제할 수 없습니다.`);  
        }  
        this.blogs = this.blogs.filter((blog) => blog.id !== foundBlog.id);  
    }  
}





