export class RoleDto {
  id: number;
  name: string;
  sort: string;
  status: number;
  remark: string | null;
  createTime: Date | null;
  updateTime: Date | null;
  updater: string | null;
  creator: string | null;
}
