import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SseMessage {
  data: string;
  event?: string;
  id?: string;
  retry?: number;
}

@Injectable()
export class SseService {
  private readonly sseSubject = new Subject<SseMessage>();

  /**
   * 创建SSE流
   */
  createSseStream(): Observable<SseMessage> {
    return this.sseSubject.asObservable();
  }

  /**
   * 发送消息给所有连接的客户端
   * @param message 消息内容
   * @param event 事件类型（可选）
   */
  sendMessage(message: string, event?: string): void {
    console.log(message, 'message')
    this.sseSubject.next({
      data: message,
      event,
      id: Date.now().toString(),
    });
  }
}
