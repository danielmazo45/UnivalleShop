import { IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';
export class CreateProductDto {
  @IsString() @MinLength(2) name: string;
  @IsString() description: string;
  @IsNumber() @Min(0) price: number;
  @IsString() @MinLength(2) category: string;
  @IsInt() @Min(0) stock: number;
  @IsOptional() @IsString() imageUrl?: string;
}
