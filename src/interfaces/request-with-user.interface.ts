import { Request } from 'express';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';

export interface RequestWithUser extends Request {
  user: JwtPayload;
}
