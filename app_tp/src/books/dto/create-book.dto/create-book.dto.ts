import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsString()
  @IsNotEmpty()
  publisher: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  publicationYear?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  publishedYear?: number;

  @IsInt()
  @Min(1)
  totalCopies: number;
}
