import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    const user = await this.authService.register(body.email, body.password);

    return {
      message: 'User created',
      user,
    };
  }

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.authService.validateUser(
      body.email,
      body.password,
    );

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
