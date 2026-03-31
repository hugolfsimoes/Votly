import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  groupId: string;

  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;
}
