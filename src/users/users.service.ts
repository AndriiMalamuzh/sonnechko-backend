import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateUserDto } from '@users/dto';
import { genSaltSync, hashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async save(body: CreateUserDto): Promise<User> {
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

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<User> {
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
