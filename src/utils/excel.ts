import { Workbook } from 'exceljs';

// 把对象数组转为二维数组
export const jsonTo2DArray = <T extends Record<string, any>>(data: T[]): T[][] => {
  const result: T[][] = [];

  const flattenObject = (obj: T): T[] => {
    const row: T[] = [];
    for (const key in obj) {
      row.push(obj[key]);
    }
    return row;
  }

  data.forEach(obj => {
    const row = flattenObject(obj);
    result.push(row);
  });

  return result;
}

// 把数据生成表格
export const generateExcel =  async <T extends Record<string, any>>(data: T[], header) => {
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Sheet1');
  worksheet.columns = header
  worksheet.addRows(data)
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}