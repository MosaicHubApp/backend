import { ApiProperty } from '@nestjs/swagger';

export class UserInterestsDto {
  @ApiProperty()
  interestIds: number[];
}