import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private stompClient: Client;
  private baseUrl = 'http://localhost:8080/api/chat';
  private messageSubject = new BehaviorSubject<any>(null);
  message$ = this.messageSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Connects to the WebSocket server */
  connect(userId: number) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        this.stompClient.subscribe(`/topic/chat.${userId}`, (message: IMessage) => {
          const parsed = JSON.parse(message.body);
          this.messageSubject.next(parsed);
        });
      }
    });
    this.stompClient.activate();
  }

  /** Sends a message via WebSocket */
  sendMessage(senderId: number, recipientId: number, content: string) {
    const msg = {
      sender: { id: senderId },
      recipient: { id: recipientId },
      content
    };
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(msg)
    });
  }

  /** Loads chat history (optional) */
  getChatHistory(user1Id: number, user2Id: number) {
    return this.http.get(`${this.baseUrl}/history`, {
      params: { user1Id, user2Id }
    });
  }
}