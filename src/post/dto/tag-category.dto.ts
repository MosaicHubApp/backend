import { IdNameDto } from '../../common/dto/id-name.dto';

export class TagCategoryDto {
  categoryName: string;
  tags: IdNameDto[];
}