import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserRes } from './dto/userRes.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getMe(@Request() req): Promise<UserRes> {
    const userId = req.user.id;
    return this.userService.userFindId(userId);
  }

  @Patch('/me')
  updateMyData(
    @Request() req,
    @Body() updateDto: UpdateUserDto,
  ): Promise<UserRes> {
    const userId = req.user.id;
    return this.userService.updateUser(userId, updateDto);
  }

  @Delete('/me')
  deletMyData(
    @Request() req,
    @Body() body: { password: string },
  ): Promise<void> {
    const userId = req.user.id;
    const { password } = body;
    return this.userService.deleteUser(userId, password);
  }
}
