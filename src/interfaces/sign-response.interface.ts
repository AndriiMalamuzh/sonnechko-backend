import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/schemas/user.schema';

export class SignResponseInterface {
  @ApiProperty({ type: User })
  user: User;

  @ApiProperty({ type: String })
  accessToken: string;
}
