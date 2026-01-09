import { IsBoolean } from 'class-validator';

export class UpdateWhitelistDto {
  @IsBoolean()
  whitelisted: boolean;
}
