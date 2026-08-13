import { Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('guest')
  guestLogin() {
    return this.authService.guestLogin();
  }
  
  @Post('google')
  googleLogin() {
    // Just mock google login same as guest for now
    return this.authService.guestLogin();
  }

  @Get('me')
  getMe() {
    return this.authService.getMe();
  }
}
