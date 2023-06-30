import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {UserService} from "../../shared/services/user.service";
import {Router} from "@angular/router";
import {User} from "../../shared/models/user";

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {

  constructor(private auth: AuthService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
  }

  get currentUser(): User | null{
    return this.userService.getCurrentUser()
  }

  logout(){
    this.auth.SignOut().then(r => {
      this.userService.removeCurrentUser()
      this.auth.token = null
      this.router.navigate(['sign-in']);
    })
  }

}
