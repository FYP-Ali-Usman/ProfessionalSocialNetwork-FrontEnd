import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  providers:[HeaderComponent],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mage: string;
  user = {
    username: '',
    password: ''
  };
  res:any;
  constructor(private apiservice: ApiService , private router: Router, private comp: HeaderComponent) { }

  ngOnInit() {
    this.comp.ngOnInit();
    var count = 0;
    $("#loginForm").submit(function() {
      var username = $("#usernameid").val();
      var password = $("#passwordid").val();
      if (username === "" || username == null) {
        $("#userpopup").css("visibility", "visible");
        $("#usernameid").addClass("is-invalid");
        return false;
      }

      if (password === "" || (password == null)) {
        $("#userpopup").css("visibility", "hidden");
        $("#usernameid").removeClass("is-invalid");
        $("#passwordpopup").css("visibility", "visible");
        $("#passwordid").addClass("is-invalid");
        return false;
      }
    });
    $("body").click(function() {
      $("#userpopup").toggle();
      $("#passwordpopup").toggle();
    });
  }

  onSubmit() {
    
    if (this.user.username.length <= 4 || this.user.password.length === 0) {
      $("#userpopup").css("visibility", "visible");
      return;
    }
    this.apiservice.verifyUser(this.user);
    if(this.apiservice.loggedIn() != true)
    {
      this.res='Invalid Credentials';
      console.log(this.res);
      this.comp.ngOnInit();
    }
    
  }

}
