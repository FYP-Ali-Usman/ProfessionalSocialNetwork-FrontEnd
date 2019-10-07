import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../app/api.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import {Profile} from '../../app/api.service';
import {HeaderComponent} from '../header/header.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FileUploader, FileSelectDirective} from 'ng2-file-upload';
@Component({
  providers:[HeaderComponent],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private apiservice: ApiService, private headercomponent:HeaderComponent , private router: Router) { }
  invalid_name:boolean;
  invalid_pass:boolean;
  invalid_rpass:boolean;
  chk1: boolean;
  checkallalphabet = /^[A-Za-z]+$/;
  u = 'Invalid Password';
  response_user:any = '';
  error_msg:any = '';
  count: number = 0;
  user_id;

  user;
  profile;
  username: string = "";
  first_name: string ="";
  last_name: string = "";
  email: string = "";
  password: string = "";
  rpassword: string = "";

  user_type:string = "";
  phonenumber:number = 0;
  organization:string = "";
  about:string = "";
  image:File;

  duser = {};
  dprofile={};
  dprofile2:Profile[]=[];

  update(value){
    console.log(value);
    this.user_type=value;
  }
  invalid_no:boolean=false;
  ngOnInit() {

    this.user_id=this.apiservice.getUserId();

    this.apiservice.getUser(this.user_id).subscribe(datadd => {
      console.log('profile retrieved');
      const kkk = datadd;
      this.duser=kkk;

    },error=>{
      console.log(error);
    }
    );

    this.apiservice.getProfile(this.user_id).subscribe(datadd => {
      console.log('profile retrieved');
      const kkk = datadd;
      this.dprofile=kkk;
      // this.dprofile['image']='http://127.0.0.1:8000/media/'+kkk['image'];
      localStorage.setItem('pid', this.dprofile['id'].toString());
      console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh'+this.dprofile['id'].toString());
      console.log(this.dprofile);
    },error=>{
      console.log(error);
    }
    );

    $('#phonenopopup').css("display", "none");
    if(this.apiservice.loggedIn()!=true)
    {
      this.router.navigate(['/Login'])
    }
    else{
      $('.ddd1').css('display', 'block');
      $('.ddd2').css('display', 'none');
      $('.ddd3').css('display', 'none');
      $('#phonenoid').keyup(function () {
        var num = $('#phonenoid').val();
        if(!isNaN(num)){
          this.invalid_no=true;
        }
        else if(isNaN(num)){
          $('#phonenopopup').css("display", "block");
          this.invalid_no=false;
        }
      });
      
    }
    $(".custom-file-input").on("change", function() {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    })
    
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

  uploadForm(){
    $('.ddd1').css('display', 'none');
    $('.ddd2').css('display', 'block');
    window.scroll(0,0);
  }
  uploadForm2(){
    $('.ddd1').css('display', 'none');
    $('.ddd3').css('display', 'block');
    window.scroll(0,0);
  }
  closeModel(){
    $('.ddd1').css('display', 'block');
    $('.ddd2').css('display', 'none');
    this.ngOnInit();
  }
  closeModel2(){
    $('.ddd1').css('display', 'block');
    $('.ddd3').css('display', 'none');
    this.ngOnInit();
  }

  onSubmit(){
    this.user_id=this.apiservice.getUserId();
    this.user = {id:this.user_id, username: this.username, first_name:this.first_name, last_name:this.last_name, email:this.email};

    if(this.user['username']==""){
      this.user['username']=this.duser['username']
    }
    if(this.user['first_name']==""){
      this.user['first_name']=this.duser['first_name']
    }
    if(this.user['last_name']==""){
      this.user['last_name']=this.duser['last_name']
    }
    if(this.user['email']==""){
      this.user['email']=this.duser['email']
    }

    console.log(this.user);
    console.log(this.profile);
    if (this.username.length <= 4) {
      this.invalid_name = true;
      return false;
    }
    

    this.apiservice.updateUser(this.user).subscribe(user => {
      $('.msg2').css('visibility', 'visible');
      console.log(user);
      this.response_user = user;
      this.username = '';
      this.password = '';
      this.rpassword = '';
      this.first_name = '';
      this.last_name = '';
      this.email = '';
      $('.msg1').css('visibility', 'hidden');
      this.headercomponent.logout();
    },error=>{
      $('.msg1').css('visibility', 'visible');
      console.log(error.error);
      this.error_msg = error.error;

    }
    );
    this.closeModel();
    window.scroll(0,0);
  }
  
  // ===============================
  selected_image:File=null;
  onFileSelected(event){
   console.log(event);
   this.selected_image=<File>event.target.files[0];
   console.log(this.selected_image);
  }


  onSubmit2(){
    const formData = new FormData();
    this.profile = {id:+localStorage.getItem('pid') ,phone: this.phonenumber, typeOf: this.user_type, organization: this.organization, image:this.selected_image, about: this.about}
    console.log(this.profile);
    if(this.profile['phone']==0){
      this.profile['phone']=this.dprofile['phone']
    }
    if(this.profile['typeOf']==""){
      this.profile['typeOf']=this.dprofile['typeOf']
    }
    if(this.profile['organization']==""){
      this.profile['organization']=this.dprofile['organization']
    }
    if(this.profile['about']==""){
      this.profile['about']=this.dprofile['about']
    }

    formData.append('id', this.profile['id']);
    formData.append('phone', this.profile['phone']);
    formData.append('typeOf', this.profile['typeOf']);
    formData.append('organization', this.profile['organization']);
    formData.append('about', this.profile['about']);
    if(this.selected_image!=null){
      formData.append('image', this.selected_image,this.selected_image.name);}
    console.log(formData.get('typeOf'));
    this.apiservice.updateProfile(formData).subscribe(data => {
      $('.msg2').css('visibility', 'visible');
      console.log('profile updated');
      console.log(data);
      this.response_user = data;
      $('.msg1').css('visibility', 'hidden');
      this.ngOnInit();
    },error=>{
      console.log(error);
      $('.msg1').css('visibility', 'visible');
      this.error_msg = error.error;
    }
    );

    this.user_type= "";
    this.phonenumber = 0;
    this.organization = "";
    this.about = ""
    this.closeModel2();
    window.scroll(0,0);
  }

}
