import { PartialType } from '@nestjs/mapped-types';
import { CreateFincaDto } from './create-finca.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateFincaDto extends PartialType(CreateFincaDto) {
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
