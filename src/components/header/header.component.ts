import { Component,ViewChild, OnInit  } from '@angular/core';
import { ApiService } from '../../app/api.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  
  constructor(private apiservice: ApiService , private router: Router) { }

  ngOnInit() {
    if(this.apiservice.loggedIn() == true){
      $(".dd2").css("display", "block");
      $(".dd1").css("display", "none");
    }
    else{
      $(".dd1").css("display", "block");
      $(".dd2").css("display", "none");
    }
  }
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('pid');
    this.ngOnInit();
    this.router.navigate['/Home'];
    console.log('lllllll');
  }

  
}
