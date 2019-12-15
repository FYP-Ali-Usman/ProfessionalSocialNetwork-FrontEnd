import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { ApiService } from '../../app/api.service';
import { json } from 'd3';
declare const createGraph: any;
@Component({
  selector: 'app-auth-view',
  templateUrl: './auth-view.component.html',
  styleUrls: ['./auth-view.component.css']
})
export class AuthViewComponent implements OnInit {
  query:any;
  author_result_obj:any={};
  pub_result:any=[];
  pub_result_obj:any={};
  network_authers:any=[]
  main_auther:any=''
  // ======================================================
  svg;
  data;
  expandedData;
  url;
  nodeExtensionNeed: Array<String> = []
  coauthers:any;
  affilia:any;
  timeLeft: number = 10;
  coAuthorUrl:any='';
  publicatonUrl:any='';
  displayHidden:any='';
  coauthbutton:string='';
  pubbutton:string='';
  coauthSearchData:any;
  pubId:any;
  user_id;
  dprofile={};
  allowAdd:boolean=true;
  allowAdd2:boolean=false;
  authRecomend=[]
  authRecomendObj={}
  profile;
  profile2;
  response_user;
  error_msg;
  favourite=[];
  showFav:any;
  showFav2:any;
  @Input()

  margin = {top: 20, right: 20, bottom: 30, left: 40};
  coautherName: never;
  // ========================================================

  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
    this.showFav='none';
    this.showFav2='none';
    this.coauthbutton='none';
    this.pubbutton='none';
    this.network_authers=[]
    this.main_auther=''
    this._Activatedroute.params.subscribe(queryParams => {
      console.log(queryParams);
      this.query=queryParams.id;
      console.log(this.query);

      this.apiservice.searchAuther2(this.query).subscribe(data=>{
        for (let index = 0; index < data.length; index++) {
          this.author_result_obj=JSON.parse(data[index]);
          this.main_auther=this.author_result_obj['urlLink'];
          this.affilia=this.author_result_obj['affiliation'];
          console.log(this.author_result_obj);
        }
  // ==============================================================
      if(this.apiservice.loggedIn() == true){
        console.log('vjacvjvdsajv ');
        // ===
        this.user_id=this.apiservice.getUserId();
        this.apiservice.getProfile(this.user_id).subscribe(datadd => {
          console.log('profile retrieved');
          const kkk = datadd;
          this.dprofile=kkk;
          console.log(this.dprofile);
// ==============================================================
      this.favourite=JSON.parse(this.dprofile['favouriteAuthors']);
      console.log(this.favourite)
      if(this.favourite!=null && this.favourite!=undefined){
        for (let index = 0; index < this.favourite.length; index++) {
          if(this.favourite[index]==this.query){
            this.showFav='none';
            this.showFav2='inline';
            break;
          }
          else{
            this.showFav='inline';
            this.showFav2='none';
          }
        }
      }else{
        this.showFav='inline';
        this.showFav2='none';
      }
// =====================================================

          this.authRecomend=JSON.parse(this.dprofile['authInterest']);
          if(this.authRecomend!=null && this.authRecomend!=undefined){
            for (let index = 0; index < this.authRecomend.length; index++) {
              if(this.authRecomend[index]['id']==this.author_result_obj['_id']['$oid']){
                this.authRecomend[index]['respect']=this.authRecomend[index]['respect']+1;
                this.allowAdd=false;
                break;
              }
            }
            if(this.allowAdd==true){
              this.authRecomendObj={id:this.author_result_obj['_id']['$oid'],respect:1}
              this.authRecomend.push(this.authRecomendObj);
            }
          }
          else{
            this.authRecomend=[];
            this.authRecomendObj={id:this.author_result_obj['_id']['$oid'],respect:1}
            this.authRecomend.push(this.authRecomendObj);
          }
          console.log(JSON.stringify(this.authRecomend));
          this.onRecomend(this.authRecomend,this.dprofile);
          
        },error=>{
          console.log(error);
        }
        );
        // ===
  
      }
      this.authRecomend=[]
      this.authRecomendObj={}
      // =======================================================

      });

      this.apiservice.searchPub(this.query).subscribe(data=>{
        this.pub_result=[];
        this.network_authers=[];
        for (let index = 0; index < data.length; index++) {
          this.pub_result_obj=JSON.parse(data[index]);
          this.pub_result.push(this.pub_result_obj);
          for (let index = 0; index < this.pub_result_obj['coAuthors'].length; index++) {
            if(!this.network_authers.includes(this.pub_result_obj['coAuthors'][index]['linkUrl'].substring(0,this.pub_result_obj['coAuthors'][index]['linkUrl'].indexOf("publication")+11))){
              this.network_authers.push(this.pub_result_obj['coAuthors'][index]['linkUrl'].substring(0,this.pub_result_obj['coAuthors'][index]['linkUrl'].indexOf("publication")+11));
            }
          }
          console.log( this.network_authers);
        }
        this.coauthers=this.network_authers.length;
        // console.log(this.pub_result);
        this.network();
      });

    });

    // =======================================================
    
  }

  
  setCoauther(value){
    this.coAuthorUrl=value;
    this.coautherName=name;
    console.log(this.coAuthorUrl);
    console.log(this.coautherName);
    this.publicatonUrl='';
    this.coauthbutton='inline';
    this.pubbutton='none';
    createGraph(this.svg, this.data, this.url,this.coAuthorUrl, this.publicatonUrl);
  }
  viewCoauther(){
    this.apiservice.coautherSerach(this.coAuthorUrl,this.coautherName).subscribe(data=>{
      for (let index = 0; index < data.length; index++){
        this.coauthSearchData=JSON.parse(data[index])}
      console.log(this.coauthSearchData['_id']['$oid']);
      this.router.navigate(['/auther',this.coauthSearchData['_id']['$oid']]);
    });
  }
  setPublication(value,id){
    this.publicatonUrl=value;
    this.pubId=id['$oid'];
    this.coAuthorUrl='';
    this.coauthbutton='none';
    this.pubbutton='inline';
    createGraph(this.svg, this.data, this.url,this.coAuthorUrl, this.publicatonUrl);
  }
  usage(){
    console.log('clicked');
  }
  viePub(){
    this.router.navigate(['/publication',this.pubId]);
  }
  reset(){
    this.coAuthorUrl='';
    this.publicatonUrl='';
    this.coauthbutton='none';
    this.pubbutton='none';
    createGraph(this.svg, this.data, this.url,this.coAuthorUrl, this.publicatonUrl);
  }
  isEmpty() {
    for(var key in this.expandedData) {
      if(this.expandedData.hasOwnProperty(key))
          return false;
    }
    return true;
  }
  expand(){
    if(this.isEmpty()){
      this.apiservice.expandNetwork(this.data.author, this.data.organization).subscribe(data=>{
        this.expandedData = data;
        createGraph(this.svg, data, this.url,this.coAuthorUrl, this.publicatonUrl);
      });
    }
    else{
      createGraph(this.svg, this.expandedData, this.url,this.coAuthorUrl, this.publicatonUrl);}
  }
  network(){
    // console.log(this.main_auther);
    // console.log(this.network_authers);
    this.apiservice.getNewtork(this.main_auther,this.affilia).subscribe(d=>{
      console.log(d);

      this.data=d;
      this.url = this.data.author;
      
      this.svg = d3.select('svg');
      // this.publicatonUrl = "https://academic.microsoft.com/paper/2539085113/reference"
      // this.publicatonUrl = "https://academic.microsoft.com/paper/2785375167/reference"
      createGraph(this.svg, this.data, this.url, this.coAuthorUrl, this.publicatonUrl);
      
      this.nodeExtensionNeed = []
      for (let i = 0; i < d['nodes'].length; i++) {
        if( d['nodes'][i]['level'] == 1){
          this.nodeExtensionNeed.push(d['nodes'][i]['urlLink']);
        }
      }
      if (this.nodeExtensionNeed.length > 0){
        this.apiservice.extend_faculty(this.nodeExtensionNeed).subscribe(data=>{
          console.log(data)
        }, err=>{
          console.log(err);
        }
        )
      }
    });
  }


  onRecomend(recommend,profile){
    const formData = new FormData();
    this.profile = {id:profile['id'],typeOf:profile['typeOf'],organization:profile['organization'],about:profile['about'],authInterest:JSON.stringify(recommend)}
    console.log(this.profile);
    
    formData.append('id', this.profile['id']);
    formData.append('authInterest', this.profile['authInterest']);
    formData.append('typeOf', this.profile['typeOf']);
    formData.append('organization', this.profile['organization']);
    formData.append('about', this.profile['about']);
    console.log(formData);
    this.apiservice.updateProfile(formData).subscribe(data => {
      $('.msg2').css('visibility', 'visible');
      console.log('profile updated');
      console.log(data);
      this.response_user = data;
      $('.msg1').css('visibility', 'hidden');
    },error=>{
      console.log(error);
      $('.msg1').css('visibility', 'visible');
      this.error_msg = error.error;
    }
    );

    this.authRecomend = [];
  }
  searchCattt(cat){
    this.router.navigate(['/searchfor',cat]);
  }

  addFavorit(aid){
    console.log(aid['$oid']);
    this.favourite=JSON.parse(this.dprofile['favouriteAuthors']);
    if(this.favourite!=null && this.favourite!=undefined){
      for (let index = 0; index < this.favourite.length; index++) {
        if(this.favourite[index]==aid['$oid']){
          this.allowAdd2=true;
          break;
        }
      }
      if(this.allowAdd2==false){
        this.favourite.push(aid['$oid']);
      }
    }
    else{
      this.favourite=[];
      this.favourite.push(aid['$oid']);
    }

    const formDataw = new FormData();
    this.profile2 = {id:this.dprofile['id'],typeOf:this.dprofile['typeOf'],organization:this.dprofile['organization'],about:this.dprofile['about'],favouriteAuthors:JSON.stringify(this.favourite)}
    console.log(this.profile);
    
    formDataw.append('id', this.profile2['id']);
    formDataw.append('favouriteAuthors', this.profile2['favouriteAuthors']);
    formDataw.append('typeOf', this.profile2['typeOf']);
    formDataw.append('organization', this.profile2['organization']);
    formDataw.append('about', this.profile2['about']);
    console.log(formDataw);
    this.apiservice.updateProfile(formDataw).subscribe(data => {
      $('.msg2').css('visibility', 'visible');
      console.log('profile updated');
      console.log(data);
      this.response_user = data;
      $('.msg1').css('visibility', 'hidden');
    },error=>{
      console.log(error);
      $('.msg1').css('visibility', 'visible');
      this.error_msg = error.error;
    }
    );
    this.favourite=[];
    this.showFav='none';
    this.showFav2='inline';
  }

}
