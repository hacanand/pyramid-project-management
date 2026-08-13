import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { MembersService } from './members.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  getMembers() {
    return this.membersService.getMembers();
  }
}
