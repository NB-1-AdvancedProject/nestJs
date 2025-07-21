import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LogInDto } from './dto/authDTO';
import { UserRes } from 'src/user/dto/userRes.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(
    @Body(ValidationPipe) userCreateDto: CreateUserDto,
  ): Promise<UserRes> {
    return this.authService.createUser(userCreateDto);
  }

  @Post('/signIn')
  signIn(
    @Body(ValidationPipe) logInDto: LogInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.singIn(logInDto);
  }

  @Post('/logout')
  logout(@Body() body: { accessToken: string }): Promise<void> {
    const { accessToken } = body;
    return this.authService.logOut(accessToken);
  }

  @Post('/refresh')
  refresh(
    @Body() body: { refreshToken: string },
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = body;
    return this.authService.refreshToken(refreshToken);
  }
}
