import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
  }

  logout(){
    console.log("ok")
    this.auth.SignOut()
  }

}
