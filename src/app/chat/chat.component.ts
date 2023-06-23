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
  apiUrl = 'http://localhost:5000/tapas';
  constructor(private http: HttpClient) { }

  sendMessage() {
    const userText = this.userMessage.trim();
    console.log(userText);
    if (userText) {
      this.messages.push({ text: userText, sender: 'user' });
      // this.userMessage = '';
      // this.messages.push({ text: 'sorry can`t find answer', sender: 'bot' });
      // Send user message to Chat-bot API
      this.http.post<any>(this.apiUrl, { user_input: userText })
        .subscribe(response => {
          console.log(response);
          const botText = response.bot_response == null ? 'sorry can`t find answer ' : response.bot_response.answer;
          console.log(response.bot_response);

          this.messages.push({ text: botText, sender: 'bot' });
          this.userMessage = "";
        });
    }
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }  
}
