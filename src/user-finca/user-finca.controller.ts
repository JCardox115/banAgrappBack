import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserFincaService } from './user-finca.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user-finca')
@UseGuards(JwtAuthGuard)
export class UserFincaController {
  constructor(private readonly userFincaService: UserFincaService) {}

  @Get('users/:userId/fincas')
  getFincasByUserId(@Param('userId') userId: number) {
    return this.userFincaService.getFincasByUserId(userId);
  }

  @Post('users/:userId/fincas')
  assignFincasToUser(
    @Param('userId') userId: number,
    @Body('fincaIds') fincaIds: number[],
  ) {
    return this.userFincaService.assignFincasToUser(userId, fincaIds);
  }

  @Get('fincas/:fincaId/users')
  getUsersByFincaId(@Param('fincaId') fincaId: number) {
    return this.userFincaService.getUsersByFincaId(fincaId);
  }
} 