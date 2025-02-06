import { Body, Controller, Logger, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { Response } from 'express';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
  
    constructor(private authService: AuthService){}


      //로그인 기능
      @Post('/signin')
      async signIn(@Body() signInRequestDto: SignInRequestDto, @Res() res:Response): Promise<void>{
          this.logger.verbose(`User with email: ${signInRequestDto.email} is try to signing in`);

        
          const accessToken = await this.authService.singIn(signInRequestDto);

          // [2] JWT를 쿠키에 저장
          res.setHeader('Authorization', accessToken);

          res.send({message: "Login Success", accessToken});

          this.logger.verbose(`User with email: ${signInRequestDto.email} issued JWT ${accessToken}`);
      }

}
 