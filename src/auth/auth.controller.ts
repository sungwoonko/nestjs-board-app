import { Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from './dto/user-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user-decorator';
import { User } from './users.entity';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

      // 회원 가입 기능
      @Post('/signup')
      async createUser(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
          const userResponseDto = new UserResponseDto(await this.authService.createUser(createUserDto));
          return userResponseDto;
      }

      //로그인 기능
      @Post('/signin')
      async signIn(@Body() loginUserDto: LoginUserDto, @Res() res:Response): Promise<void>{
          const accessToken = await this.authService.singIn(loginUserDto);

          // [2] JWT를 쿠키에 저장
          res.setHeader('Authorization', accessToken);

          res.send({message: "Login Success", accessToken});
      }

      @Post('/test')
      @UseGuards(AuthGuard('jwt')) // @UseGuards는 해당 인증 가드가 적용되는, AuthGuard는 인증가드가 어떤 전략을 사용할지 결정
      testForAuth(@GetUser() loggineduser: User){
        console.log(loggineduser); // 인증된 사용자의 정보 출력
        console.log(loggineduser.email); // 인증된 사용자의 특정 필드 접근
        return { message : 'Authenticatied User', user: loggineduser };
      }
}
 