import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/modules/users/dto';
import { UsersService } from 'src/modules/users/users.service';
import { IUser, User, userPublicFields } from 'src/schemas/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Only admin with `users_create` credential',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Return created user', type: User })
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<IUser> {
    return await this.usersService.save(body);
  }

  @ApiOperation({
    summary: 'Get user by id',
    description: 'Only admin with `users_update` credential',
  })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<IUser> {
    return await this.usersService.findById(id, userPublicFields);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string): Promise<IUser> {
    return await this.usersService.findByEmail(email, userPublicFields);
  }

  @ApiOperation({
    summary: 'Delete user by id',
    description: 'Only admin with `users_remove` credential',
  })
  @ApiResponse({ status: 200, description: 'Deleted user', type: User })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ user: string }> {
    return await this.usersService.deleteUser(id);
  }
}
