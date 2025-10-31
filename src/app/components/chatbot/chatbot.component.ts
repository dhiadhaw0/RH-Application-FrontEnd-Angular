import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService } from '../../services/chatbot.service';
import { NavbarComponent } from '../navbar/navbar.component';

interface Message {
  senderId: number;
  content: string;
  fromBot: boolean;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
  standalone: true,
  imports: [FormsModule, NavbarComponent]
})
export class ChatbotComponent implements OnInit {
  messages: Message[] = [];
  newMessage = '';
  userId = 1;       // current user (example)
  botId = 999;      // chatbot ID in backend
  isTyping = false;
  soundEnabled = true;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // connect to WebSocket
    this.chatbotService.connect(this.userId);

    // listen to bot replies
    this.chatbotService.message$.subscribe((msg: any) => {
      if (msg && msg.sender.id === this.botId) {
        this.messages.push({
          senderId: msg.sender.id,
          content: msg.content,
          fromBot: true
        });
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // display user message immediately
    this.messages.push({
      senderId: this.userId,
      content: this.newMessage,
      fromBot: false
    });

    // Show typing indicator
    this.isTyping = true;

    // send to backend
    this.chatbotService.sendMessage(this.userId, this.botId, this.newMessage);
    this.newMessage = '';

    // Simulate typing delay (remove when real backend is connected)
    setTimeout(() => {
      this.isTyping = false;
    }, 2000);
  }

  sendQuickMessage(message: string) {
    this.newMessage = message;
    this.sendMessage();
  }

  clearChat() {
    this.messages = [];
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
  }

  getMessageTime(): string {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  trackByMessage(index: number, item: Message): any {
    return item.senderId + item.content + index;
  }
}