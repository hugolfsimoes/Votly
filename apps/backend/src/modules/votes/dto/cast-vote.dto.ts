import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CastVoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  itemId: string;

  /** Nota de 1 a 10. */
  @IsInt()
  @Min(1)
  @Max(10)
  value: number;
}
