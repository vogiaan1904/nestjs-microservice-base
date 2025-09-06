import { Module } from '@nestjs/common';
import { InternalAuthService } from './internal-auth.service';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user/user.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [InternalAuthService],
  exports: [UserService],
})
export class MicroserviceModule {}
