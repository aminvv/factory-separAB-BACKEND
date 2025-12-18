import { PartialType } from '@nestjs/swagger';
import { ZarinnpalDto } from './create-zarinnpal.dto';

export class UpdateHttpDto extends PartialType(ZarinnpalDto) {}
