import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-content1',
  templateUrl: './content1.component.html',
  styleUrls: ['./content1.component.css']
})
export class Content1Component implements OnInit {
  @Input() chatMessage: string
  @Input() chatMessage2: string

  constructor() {}

  ngOnInit() {}
  public addMessage(message: string): void {
    // alert(message)

    this.chatMessage = ''
    this.chatMessage2 =
      `
    <div class="chat self">
          <div class="user-photo"></div>
            <p class="chat-message">` +
      message +
      `</p>
      </div>`
  }
}
