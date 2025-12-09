import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DictVersionService } from '../../modules/dict-version/dict-version.service';

@Injectable()
export class DictUpdateMiddleware implements NestMiddleware {
  constructor(private readonly dictVersionService: DictVersionService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Get latest dict version from service
      const latestVersion = await this.dictVersionService.getCurrentVersion();
      
      // Add version to response header using recommended name
      res.setHeader('X-Dictionary-Version', latestVersion);
    } catch (error) {
      // Service operation failed, record error but don't block request
      console.error('DictUpdateMiddleware: Failed to get latest dict version:', error);
    }
    
    // Continue processing request
    next();
  }
}
