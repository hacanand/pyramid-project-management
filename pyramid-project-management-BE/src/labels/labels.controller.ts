import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LabelsService } from './labels.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@Controller('labels')
@UseGuards(AuthGuard)
export class LabelsController {
  constructor(private readonly labelsService: LabelsService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getLabels() {
    return this.labelsService.getLabels();
  }
}
