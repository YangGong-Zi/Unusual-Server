import { Controller, Sse, Post, Body } from '@nestjs/common';
import { SseService, SseMessage } from './sse.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Observable } from 'rxjs';

@Controller('sse')
@ApiTags('SSE实时消息推送')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  /**
   * 建立SSE连接
   */
  @Sse('connect')
  @Public()
  @ApiOperation({ summary: '建立SSE连接' })
  @ApiResponse({ status: 200, description: 'SSE连接建立成功' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  sseConnect(): Observable<SseMessage> {
    return this.sseService.createSseStream();
  }

  /**
   * 发送消息
   */
  @Post('send')
  @Public()
  @ApiOperation({ summary: '发送消息给所有连接的客户端' })
  @ApiResponse({ status: 200, description: '消息发送成功' })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  @ApiResponse({ status: 500, description: '服务器内部错误' })
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    const { content, event } = sendMessageDto;
    this.sseService.sendMessage(content, event);
    return {
      code: 200,
      message: '消息发送成功',
      data: { content, event },
    };
  }
}
