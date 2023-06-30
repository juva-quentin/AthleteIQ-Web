import { Component } from '@angular/core';
import {AuthService} from "./shared/services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'athlete-iq-web';

  constructor(private auth: AuthService) {
  }

  get isConnect(){
    return this.auth.loggedIn
  }
}
