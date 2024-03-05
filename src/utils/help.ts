import { Request } from 'express';

// 通过 请求头拿到 token
export const extractTokenFromHeader = (request: Request): string | undefined => {

  const [type, token] = request.headers.authorization?.split(' ') ?? [];
  // return token
  return type === 'Bearer' ? token : undefined;
}

// 把svg转换为图片的base64
export const convertSvgToPng = (svgData) => {
  return new Promise((resolve, reject) => {
    const svg2img = require('svg2img');
    svg2img(svgData, function(error, buffer) {
      if (error) {
        reject(error);
      } else {
        resolve(buffer.toString('base64'));
      }
    });
  });
}