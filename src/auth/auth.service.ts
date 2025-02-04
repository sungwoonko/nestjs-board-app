import { BadRequestException, ConflictException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User} from './users.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole } from './users-role.enum';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';


@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    // 회원 가입 기능
    async createUser(createUserDto: CreateUserDto):Promise<User>{
        const {username,password,email,role} = createUserDto;    
        // 유효성 검사  
        if (!username || !password || !email || !role) {  
            throw new BadRequestException('Something went wrong.');  
        }

        await this.checkEmailExist(email);

        const hashedPassword = await this.hashPassword(password);

        const newUser: User = {
            id: 0, // 임시 초기화
            username, // author : createBoardDto.author
            password: hashedPassword,
            email,
            role: UserRole.USER
        };
        const createdUser = await this.userRepository.save(newUser);
        return createdUser;
    } 

    // 로그인 기능
    async singIn(loginUserDto: LoginUserDto): Promise<string> {
        const {email, password} = loginUserDto;
        
        try{
            const existingUser = await this.findUserByEmail(email);

            if(!existingUser || !(await bcrypt.compare(password, existingUser.password))){
                throw new UnauthorizedException('Invalid credentials');
            }

            // [1] JWT 토큰 생성
            const payload = {
                id: existingUser.id,
                password: existingUser.password,
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
            };
            const accessToken = await this.jwtService.sign(payload);

            return accessToken;
        } catch (error) {
            throw error;
        }
    
    }



    async findUserByEmail(email: string): Promise<User>{
        const existingUser = await this.userRepository.findOne({where: {email}});
        if(!existingUser){
            throw new NotFoundException('User not found');
        }
        return existingUser;
    }

    async checkEmailExist(email: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({where: {email}});
        if(existingUser){
            throw new ConflictException('Email already exists');
        }
       
    }

    async hashPassword(password: string): Promise<string>{
       const salt = await bcrypt.genSalt(); // salt 생성
       return await bcrypt.hash(password, salt);
    }
}
