import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get()
  getInfo() {
    return this.githubService.githubApi();
  }
  @Get('/commits')
  getCommits(@Query('page') page: string, @Query('per_page') per_page: string) {
  const path = `/commits?page=${page}&per_page=${per_page}`
    return this.githubService.githubApi(path);
  }
  @Get('/traffic/views')
  getViews() {
    return this.githubService.githubApi('/traffic/views');
  }
  @Get(':path')
  getDetailes(@Param('path') path: string) {
    return this.githubService.githubApi('/' + path);
  }

}
