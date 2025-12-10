import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: '消息内容',
    example: 'Hello, SSE!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: '消息内容不能超过1000个字符' })
  content: string;

  @ApiProperty({
    description: '事件类型（可选）',
    example: 'chat',
    required: false,
  })
  @IsString()
  @MaxLength(50, { message: '事件类型不能超过50个字符' })
  event?: string;
}
