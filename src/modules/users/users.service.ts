import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/modules/users/dto';
import { IUser, User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<IUser>) {}

  async save(body: CreateUserDto): Promise<IUser> {
    body.email = body.email.toLowerCase();
    const user = await this.userModel.findOne({ email: body.email });
    if (user) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = this.hashPassword(body.password);
    const createdUser = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });
    return this.findById(createdUser._id.toString());
  }

  async findById(id: string): Promise<IUser> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<IUser> {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private hashPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }
}
