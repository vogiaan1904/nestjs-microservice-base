import { AppConfigService } from '@services/config.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { authEndpoints } from './user.endpoint';
import { InternalAuthService } from '../internal-auth.service';
import { FilterUserDto } from './dtos/query-user.dto';
import { UserDto } from './dtos/user.response.dto';
import { IUserContext } from '@interfaces/user-ctx.interface';

@Injectable()
export class UserService {
  private readonly baseUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: AppConfigService,
    private readonly internalAuthService: InternalAuthService,
  ) {
    this.baseUrl = this.config.microservicesConfig.auth;
  }

  async getUserProfile(userCtx: IUserContext, userId: string): Promise<UserDto> {
    const url = `${this.baseUrl}${authEndpoints.findUserById.replace(':id', userId)}`;
    const headers = this.internalAuthService.buildUserJwtHeader(userCtx);

    const response = await lastValueFrom(this.http.get<UserDto>(url, { headers }));
    return response.data;
  }

  async findAllUsers(filter: FilterUserDto): Promise<UserDto[]> {
    const url = `${this.baseUrl}${authEndpoints.findManyUsers}`;
    const headers = this.internalAuthService.buildServiceJwtHeader();

    const response = await lastValueFrom(this.http.get<UserDto[]>(url, { headers }));
    return response.data;
  }
}
