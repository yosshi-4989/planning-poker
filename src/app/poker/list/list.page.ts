import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  signOut() {
    this.auth.authSignOut();
  }
}
