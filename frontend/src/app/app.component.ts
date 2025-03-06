import {Component, HostListener} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HR System';

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: Event) {
    localStorage.removeItem('token');
  }
}
