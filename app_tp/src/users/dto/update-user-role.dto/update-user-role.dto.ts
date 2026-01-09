import { IsEnum } from 'class-validator';
import { UserRoleEnum } from '../../../common/enums/user-role.enum/user-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
