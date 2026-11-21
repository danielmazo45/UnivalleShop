import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNumber, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
export class OrderItemDto {
  @IsString() productId: string;
  @IsInt() @Min(1) quantity: number;
  @IsNumber() @Min(0) unitPrice: number;
}
export class CreateOrderDto {
  @IsString() userId: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
