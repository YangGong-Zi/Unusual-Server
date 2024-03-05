import { ValueTransformer } from "typeorm";

// 自定义转换器，将数据库中的 0 转换为 false，将 1 转换为 true
export const booleanTransformer: ValueTransformer = {
  to: (value: boolean) => value ? 1 : 0,
  from: (value: number) => value === 1 ? true : false,
};