import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
import { User } from '../../app/api.service'

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.css']
})
export class SingupComponent implements OnInit {
  username: string = "";
  first_name: string ="";
  last_name: string = "";
  email: string = "";
  password: string = "";
  rpassword: string = "";
  count: number = 0;
  invalid_name: boolean;
  invalid_pass: boolean;
  invalid_rpass: boolean;
  invalid_no: boolean;
  chk1: boolean;
  checkallalphabet = /^[A-Za-z]+$/;
  u = 'Invalid Password';
  user;
  profile;
  response_user:any = '';
  error_msg:any = '';
  constructor(private apiservice: ApiService , private router: Router) { }

  ngOnInit() {

    var usercheck = 'Username length must be greater than 6';
    $('#usernameid').click(function () {
      var i = $('#usernameid').val();
      if (i == null || i === "") {
        $('#check1').html(usercheck);
      }
    });
    $('#usernameid').keyup(function () {
      $('#check1').html(usercheck);
      var v = $('#usernameid').val();
      v = v.length;
      if (v <= 6) {
        $('#check1').addClass("text-danger");
      }
      if (v > 6) {
        $('#check1').html('');
        $('#check1').removeClass("text-danger");
      }
    });
    var only1 = false;
    var only2 = false;
    var only3 = false;
    var pascheck = "The password must comply with the following:";
    var l1 = "It contain atleast 1 character other than alphabet.";
    var l2 = "Password length must be greater than 9.";
    var l3 = "Both field of password must match.";

    $('#passwordid').click(function () {
      $('#pcli').css('display', 'block');
      $('#check2').css('display', 'block');
      var h = $('#passwordid').val();
      if (h == null || h === "") {
        $('#check2').html(pascheck);
        if (only1 === false) {
          $('#pcli').append('<li id="l11">' + l1 + '</li>');
          only1 = true;
        }
        if (only2 === false) {
          $('#pcli').append('<li id="l12">' + l2 + '</li>');
          only2 = true;
        }
        if (only3 === false) {
          $('#pcli').append('<li id="l13">' + l3 + '</li>');
          only3 = true;
        }
      }
    });


    $('#passwordid').keyup(function () {
      $('#pcli').css('display', 'block');
      $('#check2').css('display', 'block');
      $('#check2').html(pascheck);
      if (only1 === false) {
        $('#pcli').append('<li id="l11">' + l1 + '</li>');
        only1 = true;
      }
      if (only2 === false) {
        $('#pcli').append('<li id="l12">' + l2 + '</li>');
        only2 = true;
      }
      if (only3 === false) {
        $('#pcli').append('<li id="l13">' + l3 + '</li>');
        only3 = true;
      }



      var v = $('#passwordid').val();
      var checkallalphabe = /^[A-Za-z]+$/;
      if (v.match(checkallalphabe)) {
        $('#l11').addClass("text-danger");
      }
      else if (v !== "" && v != null) {
        $('#l11').removeClass("text-danger");
        $('#l11').remove();
        only1 = false;
      }
      v = v.length;
      if (v <= 8) {
        $('#l12').addClass("text-danger");
      }
      if (v > 8) {
        $('#l12').removeClass("text-danger");
        $('#l12').remove();
        only2 = false;
      }

      $('#rpasswordid,#passwordid').keyup(function () {

        var password = $('#passwordid').val();
        var rpassword = $('#rpasswordid').val();

        if (password !== rpassword) {
          if (only3 === false) {
            $('#pcli').append('<li id="l13">' + l3 + '</li>');
            only3 = true;
          }
          $('#l13').addClass("text-danger");
        }
        else {
          $('#l13').removeClass("text-danger");
          $('#l13').remove();
          $('#check2').html('');
          only3 = false;
          $('#pcli').css('display', 'none');
          $('#check2').css('display', 'none');
        }
      });
    });
    
  }
  // ======================================================================
  onSubmit() {
    $('.msg1').css('visibility', 'hidden');
    $('.msg2').css('visibility', 'hidden');
    this.user = { username: this.username, first_name:this.first_name, last_name:this.last_name, email:this.email, password: this.password, password2: this.rpassword};
    this.profile = {phone: 0, typeOf: 'empty', organization: 'empty', about: 'empty'}
    console.log(this.user);
    if (this.username.length <= 4) {
      this.invalid_name = true;
      return false;
    }
    if (
      this.password.match(this.checkallalphabet) ||
      (this.password.length <= 8 && this.count !== 1)
    ) {
      this.invalid_name = false;
      this.invalid_pass = true;
      return false;
    }
    if (this.password !== this.rpassword) {
      this.invalid_pass = true;
      this.invalid_rpass = true;
      this.u = 'Password does not match';
      return false;
    }

    this.apiservice.addUser(this.user).subscribe(user => {
      $('.msg2').css('visibility', 'visible');
      console.log(user);
      this.apiservice.addProfile(user,this.profile).subscribe(data => {
        console.log('profile created');
      },error=>{
        console.log(error);
      }
      );


      this.response_user = user;
      this.username = '';
      this.password = '';
      this.rpassword = '';
      this.first_name = '';
      this.last_name = '';
      this.email = '';
      $('.msg1').css('visibility', 'hidden');
    },error=>{
      $('.msg1').css('visibility', 'visible');
      console.log(error.error);
      this.error_msg = error.error;

    }

    
    
    );
    
  }
  
}
