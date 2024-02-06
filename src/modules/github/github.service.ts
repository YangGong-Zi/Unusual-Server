import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs';

@Injectable()
export class GithubService {

  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}
  public githubConfig = this.configService.get('GITHUB');
  public baseUrl = this.githubConfig.path;
  public config = {
    headers: {
      'Authorization': this.githubConfig.Authorization
    },
    timeout: this.githubConfig.timeout
  }

  // 获取仓库信息
  githubApi(path: string = '')  {
    const data = this.httpService.get(this.baseUrl + path, this.config)
    return data.pipe(map(res => res.data));

  }
}
