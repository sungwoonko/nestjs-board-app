import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User} from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    // 회원 가입 기능
    async createUser(createUserDto: CreateUserDto):Promise<User>{
        const {username,password,email,role} = createUserDto;    
        // 유효성 검사  
        if (!username || !password || !email || !role) {  
            throw new BadRequestException('Something went wrong.');  
        }
        const newUser: User = {
            id: 0, // 임시 초기화
            username, // author : createBoardDto.author
            password,
            email,
            role
        };
        const createdUser = await this.userRepository.save(newUser);
        return createdUser;
    } 
}
