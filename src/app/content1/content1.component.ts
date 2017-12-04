import { Component, Input, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'

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
  public chatArray: Array<any> = []
  // public results = []
  results: Object

  // Inject HttpClient into your component or service.
  constructor(private http: HttpClient) {}

  // Beim initialen Aufruf der Seite:
  ngOnInit(): void {
    // Wir zeigen ein Prompt (pop-up) und weisen den Input an `name` zu
    // Neu: Bis er einen Namen eingibt.
    while (this.name == '' || this.name == null) {
      this.name = prompt('Halt. Stop. Wie heisst du?')
    }

    // THIS will read the data from the server. (only initial)
    this.http
      .get<any[]>('https://immense-refuge-35508.herokuapp.com/history')
      .subscribe(data => {
        // Read the result field from the JSON response and merge them with chatArray into chatArray. (chatArray + data = chatArray)
        this.chatArray = [...this.chatArray, ...data]
      })
  }

  // Jedesmal, wenn "Senden" gedrückt wird:
  public addMessage(message: string): void {
    // Textfeld zurücksetzen
    this.chatMessage = ''

    // Jede neue Nachricht wird an die Liste `chatArray` angehängt
    this.chatArray.push(message)

    // THIS will send the message to the server.
    const body = { message: message, nickname: this.name }
    this.http
      .post('https://immense-refuge-35508.herokuapp.com/history', body)
      .subscribe()
  }
}
