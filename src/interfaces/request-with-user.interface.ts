import { Request } from 'express';
import { User } from '../schemas/user.schema';

export interface RequestWithUser extends Request {
  user: User;
}
