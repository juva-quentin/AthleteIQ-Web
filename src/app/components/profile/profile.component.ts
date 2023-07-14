import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {User} from "../../shared/models/user";
import {AuthService} from "../../shared/services/auth.service";
import {UsersService} from "../../shared/services/user/users.service";
import {FormBuilder, FormGroup} from "@angular/forms";



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  showEditPopup = false;
  editForm: FormGroup | undefined;
  constructor(
    private dialog: MatDialog,
    public authService: AuthService,
    private route: ActivatedRoute,
    private userService: UsersService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit() {
    // ...
    this.initEditForm();
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      pseudo: [this.currentUser?.pseudo],
      email: [this.currentUser?.email],
      objective: [this.currentUser?.objectif],
      image: [this.currentUser?.image]
    });
  }


  get currentUser(): User | null{
    return this.userService.getCurrentUser()
  }



  getProgressPercentage(): string {
    const progress = (this.currentUser?.totalDist ?? 0 *100) / (this.currentUser?.objectif ?? 0);

    return `${progress}%`;
  }

}
