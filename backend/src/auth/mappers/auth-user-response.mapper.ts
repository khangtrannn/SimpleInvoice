import { UserEntity } from '../../users/entities/user.entity';
import { AuthUserResponseDto } from '../dto/auth-user-response.dto';

export function toAuthUserResponse(user: UserEntity): AuthUserResponseDto {
  return {
    id: user.id,
    email: user.email,
    fullname: user.fullname,
  };
}