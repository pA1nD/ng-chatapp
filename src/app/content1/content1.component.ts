import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-content1',
  templateUrl: './content1.component.html',
  styleUrls: ['./content1.component.css']
})
export class Content1Component implements OnInit {
  @Input() chatMessage: string

  // Wir führen zwei public Properties ein: `name` (string) und `chatArray` (array mit strings)
  public name: string = ''
  public time = new Date().getTime()
  public chatArray: Array<String> = []

  constructor() {}

  // Beim initialen Aufruf der Seite:
  ngOnInit() {
    // Wir zeigen ein Prompt (pop-up) und weisen den Input an `name` zu
    // Neu: Bis er einen Namen eingibt.
    while (this.name == '' || this.name == null) {
      this.name = prompt('Halt. Stop. Wie heisst du?')
    }
  }

  // Jedesmal, wenn "Senden" gedrückt wird:
  public addMessage(message: string): void {
    // Textfeld zurücksetzen
    this.chatMessage = ''

    // Jede neue Nachricht wird an die Liste `chatArray` angehängt
    this.chatArray.push(message)
  }
}
