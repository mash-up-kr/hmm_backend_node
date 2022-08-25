import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/api/member/guard/jwt.guard';
import { AlertService } from '../service/alert.service';

type User = { user: { id: number } };

@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAlerts(@Req() req: User) {
    return await this.alertService.getAlerts(req.user.id);
  }
}
