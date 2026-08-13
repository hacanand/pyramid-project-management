import { Injectable } from '@nestjs/common';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class AuthService {
  constructor(private readonly profileService: ProfileService) {}

  async guestLogin() {
    const user = await this.profileService.getProfile();
    return {
      token: 'guest-mock-token',
      user,
    };
  }

  async getMe() {
    return this.profileService.getProfile();
  }
}
