import { Module } from '@nestjs/common';
import { InternalAuthService } from './internal-auth.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [HttpModule, JwtModule],
  controllers: [],
  providers: [InternalAuthService, UserService],
  exports: [UserService],
})
export class MicroserviceModule {}
