import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { ApiService } from '../../app/api.service';
import { json } from 'd3';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  author_result:any=[];
  author_result_j:any=[];
  author_result2:any=[];
  author_result_obj:any={};

  author_resulty:any=[];
  author_resulty_j:any=[];
  author_result2y:any=[];
  author_result_objy:any={};

  query;
  author:any='';
  user_id:any;
  dprofile={};
  count;
  count1;
  auth1=[];
  auth2=[];
  favourite=[];
  allowAdd2: boolean;
  profile2: { id: any; typeOf: any; organization: any; about: any; favouriteAuthors: string; };
  profile: any;
  response_user: import("d:/BOOK/BSCS/FYP/30 PERCENT/Angular-Front_End-/src/app/api.service").Profile[];
  error_msg: any;
  favourite2: any[];
  favtosub: any;
  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
    this.showFavMethodf();
  }
  showFavMethodf(){
    if(this.apiservice.loggedIn() == true){
      // ===
      this.user_id=this.apiservice.getUserId();
      this.apiservice.searchAutherFav(this.user_id).subscribe(datade => {
        console.log(datade);

        this.count=Math.ceil(datade.length/2);
        this.count1=datade.length-this.count;
        this.author_result=[];
        this.author_resulty=[];

        for (let index = 0; index < this.count; index++) {
          this.author_result.push(JSON.parse(datade[index]));
        }
        this.author_result2=this.author_result;

        for (let index1 = this.count; index1 < datade.length; index1++) {
          this.author_resulty.push(JSON.parse(datade[index1]));
        }
        this.author_result2y=this.author_resulty;
        // =========================

      },
      error=>{
        console.log(error);
      });

      
    
    }
    else{
      console.log('no');
    }
    this.author_resulty=[];
    this.author_result=[];
    this.author_result2=[];
    this.author_result2y=[];
    this.auth1=[];
    this.auth2=[];
  }

  deletefav(oid){
    console.log(oid['$oid'])
    this.user_id=this.apiservice.getUserId();
    this.apiservice.getProfile(this.user_id).subscribe(datadd => {
      console.log('profile retrieved');
      const kkk = datadd;
      this.dprofile=kkk;

      this.favourite=JSON.parse(this.dprofile['favouriteAuthors']);
      this.favourite2=[];
      if(this.favourite.length>1){
        for (let index = 0; index < this.favourite.length; index++) {
          if(this.favourite[index]!=oid['$oid']){
            this.favourite2.push(this.favourite[index]);
          }
        }
        this.favtosub=JSON.stringify(this.favourite2)
      }
      else if(this.favourite.length==1){
        this.favtosub=null;
      }
      else{
        this.favtosub=null;
      }

      const formDataw = new FormData();
      this.profile2 = {id:this.dprofile['id'],typeOf:this.dprofile['typeOf'],organization:this.dprofile['organization'],about:this.dprofile['about'],favouriteAuthors:this.favtosub}
      console.log(this.profile);
      
      formDataw.append('id', this.profile2['id']);
      formDataw.append('favouriteAuthors', this.profile2['favouriteAuthors']);
      formDataw.append('typeOf', this.profile2['typeOf']);
      formDataw.append('organization', this.profile2['organization']);
      formDataw.append('about', this.profile2['about']);
      
      this.apiservice.updateProfile(formDataw).subscribe(data => {
        $('.msg2').css('visibility', 'visible');
        console.log('profile updated');
        
        this.response_user = data;
        $('.msg1').css('visibility', 'hidden');
        this.showFavMethodf();
      },error=>{
        console.log(error);
        $('.msg1').css('visibility', 'visible');
        this.error_msg = error.error;
      }
      );
      this.favourite=[];
    
    },
    error=>{
      console.log(error);
    });
    this.favourite=[];
    this.favourite2=[];
    this.favtosub=null;
    
  }

}
