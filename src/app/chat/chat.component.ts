import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  text: string;
  sender: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
public messages: ChatMessage[] = [];
 public userMessage: string = '';
 apiUrl='api ur';
  constructor(private http: HttpClient) {}

  sendMessage() {
    const userText = this.userMessage.trim();
    if (userText) {
      this.messages.push({ text: userText, sender: 'user' });
      this.userMessage ='' ;
      this.messages.push({ text: 'sorry cann`t find answer', sender: 'bot' });
      // Send user message to ChatGPT API
      this.http.post<any>(this.apiUrl, { message: userText })
        .subscribe(response => {
          const botText = response.message ==null  ? 'sorry cann`t find answer ' :response.message ;
        
          this.messages.push({ text: botText, sender: 'bot' });
        });
    }
  }
}
