import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AgentService } from '../../services/agent';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput = '';
  isLoading = false;
  sessionId = uuidv4();

  constructor(private agentService: AgentService) {}

  ngOnInit() {
    this.sendWelcome();
  }

sendWelcome() {
  this.isLoading = true;
  this.agentService.chat('hello', this.sessionId).subscribe({
    next: (response) => {
      this.messages.push({
        role: 'agent',
        content: response.reply,
        timestamp: new Date()
      });
      this.isLoading = false;
    },
    error: () => {
      this.messages.push({
        role: 'agent',
        content: 'Hello! I am your Finance Agent. How can I help you today?',
        timestamp: new Date()
      });
      this.isLoading = false;
    }
  });
}

  sendMessage() {
    const message = this.userInput.trim();
    if (!message || this.isLoading) return;

    this.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    this.userInput = '';
    this.isLoading = true;

    this.agentService.chat(message, this.sessionId).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'agent',
          content: response.reply,
          timestamp: new Date()
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.messages.push({
          role: 'agent',
          content: 'Sorry, something went wrong. Please try again.',
          timestamp: new Date()
        });
        this.isLoading = false;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }
}
