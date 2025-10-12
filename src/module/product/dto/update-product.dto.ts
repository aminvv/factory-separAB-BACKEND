import { PartialType } from '@nestjs/mapped-types';
import { ProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(ProductDto) {}
