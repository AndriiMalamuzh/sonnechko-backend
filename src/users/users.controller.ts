import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '@users/dto';
import { User } from 'src/schemas/user.schema';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Create new user',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Return created user',
    type: User,
  })
  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.save(body);
  }

  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user',
    type: User,
  })
  @Get(':id')
  async findById(@Param('id') id: string): Promise<User> {
    return await this.usersService.findById(id);
  }

  @ApiOperation({
    summary: 'Get user by email',
  })
  @ApiResponse({
    status: 200,
    description: 'Return user',
    type: User,
  })
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  @ApiOperation({
    summary: 'Delete user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Deleted user',
    type: User,
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<User> {
    return await this.usersService.deleteUser(id);
  }
}
