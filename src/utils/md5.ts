import * as md5 from 'md5';

export const md5Encrypt = (str: string): string => {
  if(!str) return str
  return md5(str)
}