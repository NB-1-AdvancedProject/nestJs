import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LogInDto } from './dto/authDTO';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/singup')
  singup(@Body(ValidationPipe) userCreateDto: CreateUserDto): Promise<User> {
    return this.authService.createUser(userCreateDto);
  }

  @Post('/singIn')
  singIn(
    @Body(ValidationPipe) logInDto: LogInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(logInDto);
  }

  @Post('/logout')
  logout(@Body() body: { userId: string; accessToken: string }): Promise<void> {
    const { userId, accessToken } = body;
    return this.authService.logOut(userId, accessToken);
  }
}
