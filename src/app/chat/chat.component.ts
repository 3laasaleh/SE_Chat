import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

interface ChatMessage {
  text: string;
  rows: [];
  columns: [];
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
  public historyIndex: number = -1;
  apiUrl = 'http://localhost:5000/api/qa';
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  constructor(private http: HttpClient) { }

  sendMessage() {
    const userText = this.userMessage.trim();
    console.log(userText);
    if (userText) {
      this.userMessage = "";
      this.scrollToBottom();
      this.messages.push({ text: userText, sender: 'user', rows: [], columns: [] });

      // Send user message to Chat-bot API
      this.http.post<any>(this.apiUrl, { model_name: "gpt", user_input: userText }, { withCredentials: false })
        .pipe(
          catchError(error => {
            console.error('An error occurred while making the HTTP request:', error);
            this.messages.push({ text: "No results found", sender: 'bot', rows: [], columns: [] });
            return of(null); // Return a new observable with a null value to continue the subscription
          })
        )
        .subscribe(response => {
          try {
            if (response == null)
              console.log('No bot response');
            else {
              let botResponse = response.bot_response;
              this.messages.push({ text: "Success", sender: 'bot', rows: botResponse[0], columns: botResponse[1] });
            }

            this.scrollToBottom();
          } catch (error) {
            console.error("An error occurred while processing the response:", error);
            this.messages.push({ text: "No results found", sender: 'bot', rows: [], columns: [] });
          }
        });
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
    }, 0);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.sendMessage();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.historyIndex === -1) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
          if (this.messages[i].sender === 'user') {
            this.historyIndex = i;
            break;
          }
        }
      } else if (this.historyIndex > 0) {
        for (let i = this.historyIndex - 1; i >= 0; i--) {
          if (this.messages[i].sender === 'user') {
            this.historyIndex = i;
            break;
          }
        }
      }
      if (this.historyIndex >= 0) {
        this.userMessage = this.messages[this.historyIndex].text;
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.historyIndex >= 0 && this.historyIndex < this.messages.length - 1) {
        for (let i = this.historyIndex + 1; i < this.messages.length; i++) {
          if (this.messages[i].sender === 'user') {
            this.historyIndex = i;
            break;
          }
        }
        if (this.historyIndex >= 0) {
          this.userMessage = this.messages[this.historyIndex].text;
        }
      } else if (this.historyIndex === this.messages.length - 1) {
        this.historyIndex = -1;
        this.userMessage = '';
      }
    }
  }

  getBackgroundColor(colIndex: number) {
    if (colIndex % 2 === 0)
      return '#f2f2f2';
    else
      return '#2f78c9';
  }

  isEven(index: number): boolean {
    return index % 2 === 0;
  }

}
