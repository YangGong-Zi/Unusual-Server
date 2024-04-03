import { SetMetadata } from '@nestjs/common';

export const IS_PERMISSIONS_KEY = 'isPermissions';
export const CheckPermissions = (permissions: string[]) => SetMetadata(IS_PERMISSIONS_KEY, permissions);
