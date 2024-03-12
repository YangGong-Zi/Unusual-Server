export class DictDetailDto {
  id: number;
  pid: number;
  label: string;
  value: string;
  dictSort: number | null;
  createTime: Date | null;
  updateTime: Date | null;
  creator: string | null;
  updater: string | null;
}
