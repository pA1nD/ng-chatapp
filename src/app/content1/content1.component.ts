import {
  Component,
  Input,
  OnInit,
  AfterViewChecked,
  ElementRef
} from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Md5 } from 'ts-md5/dist/md5'

const server = 'https://immense-refuge-35508.herokuapp.com'
// const server = 'http://localhost:5000'

@Component({
  selector: 'app-content1',
  templateUrl: './content1.component.html',
  styleUrls: ['./content1.component.css']
})
export class Content1Component implements OnInit, AfterViewChecked {
  @Input() chatMessage: string

  // Initialize public properties: name, email and chatArray.
  public name: string = ''
  public email: string = ''
  public chatArray = []
  public usercount: number = 0

  // init elChatList and _prevChatHeight. Handeling scrolling down.
  private elChatList
  private _prevChatHeight: number = 0

  // Inject HttpClient into your component or service.
  // get a reference to the element and receive elChatList AfterContentInit.
  constructor(private http: HttpClient, private element: ElementRef) {}
  ngAfterContentInit(): void {
    this.elChatList = this.element.nativeElement.querySelector('.chatlogs')
  }

  // Logic for scrolling down afer render.
  public ngAfterViewChecked(): void {
    /* compares prev and current scrollHeight */
    var canScrollDown = this._prevChatHeight !== this.elChatList.scrollHeight
    this._prevChatHeight = this.elChatList.scrollHeight
    if (canScrollDown) {
      this.elChatList.scrollTop = this.elChatList.scrollHeight
    }
  }

  // Beim initialen Aufruf der Seite:
  ngOnInit(): void {
    // Wir zeigen ein Prompt (pop-up) und weisen den Input an `name` zu
    // Neu: Bis er einen Namen eingibt.
    this.name = 'Björn'
    this.email = 'bs@websites-smart.de'
    while (this.name == '' || this.name == null) {
      this.name = prompt('Hallo! Wie heisst du?')
    }
    while (this.email == '' || this.email == null) {
      this.email = prompt(`Hallo ${this.name}! Wie lautet deine E-Mail?`)
    }

    // THIS will read the data from the server. (polling)
    let sleep = time => new Promise(resolve => setTimeout(resolve, time))
    let poll = (promiseFn, time) =>
      promiseFn().then(sleep(time).then(() => poll(promiseFn, time)))

    poll(
      () =>
        new Promise(() => {
          console.log('!')
          this.http.get<any>(`${server}/history`).subscribe(data => {
            // Read the result field from the JSON response and iterate over it. Change the Date to the a string in the locale date!
            let chatHistory = data.chatHistory.map(e => {
              e.dateString = new Date(e.date).toLocaleString()
              e.img =
                'https://www.gravatar.com/avatar/' +
                Md5.hashStr(e.email.trim().toLowerCase())

              let s = e.sentiment.score

              if (s >= 2) e.emoji = '😆'
              if (s == 1) e.emoji = '😁'
              if (s == 0) e.emoji = '🙂'
              if (s == -1) e.emoji = '🙁'
              if (s <= -2) e.emoji = '🍋'
              // if (s == -3) e.emoji = '😤'
              // if (s < -3) e.emoji = '😡'
              return e
            })
            this.chatArray = chatHistory
            this.usercount = data.usercount
          })
        }),
      3000
    )
  }

  // Jedesmal, wenn "Senden" gedrückt wird:
  public addMessage(message: string): void {
    // Textfeld zurücksetzen
    this.chatMessage = ''

    // Create Object with message. We call it payload.
    const payload = {
      message: message,
      nickname: this.name,
      email: this.email,
      img: '',
      date: new Date()
    }

    // Jede neue Nachricht wird an die Liste `chatArray` angehängt. This will be later overwritten by the answer from the server.
    this.chatArray.push(payload)

    // THIS will send the message to the server.
    this.http.post(`${server}/history`, payload).subscribe()
  }
}
