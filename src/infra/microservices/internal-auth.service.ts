import { JwtService } from '@nestjs/jwt';
import { IUserContext } from '@interfaces/user-ctx.interface';
import { IServiceContext } from '@interfaces/service-ctx.interface';
import { Injectable } from '@nestjs/common';

interface UserJwtPayload extends IUserContext {
  token_type: 'user';
}

interface ServiceJwtPayload extends IServiceContext {
  token_type: 'service';
  scopes?: string[];
}

interface JwtOptions {
  expiresIn?: string;
  issuer?: string;
  audience?: string;
}

@Injectable()
export class InternalAuthService {
  constructor(private readonly jwtService: JwtService) {}

  buildUserJwtHeader = (userPayload: IUserContext, options?: JwtOptions) => {
    const token = this.jwtService.sign(
      {
        ...userPayload,
        token_type: 'user',
      } as UserJwtPayload,
      {
        expiresIn: options?.expiresIn || '15m',
        // issuer: options?.issuer || 'gateway',
        // audience: options?.audience || 'event-service',
      },
    );

    return {
      Authorization: `Bearer ${token}`,
    } as const;
  };

  buildServiceJwtHeader = (options?: JwtOptions) => {
    const token = this.jwtService.sign(
      {
        token_type: 'service',
      } as ServiceJwtPayload,
      {
        expiresIn: options?.expiresIn || '5m',
        // issuer: options?.issuer || 'gateway',
        // audience: options?.audience || 'event-service',
      },
    );

    return {
      Authorization: `Bearer ${token}`,
    } as const;
  };
}
