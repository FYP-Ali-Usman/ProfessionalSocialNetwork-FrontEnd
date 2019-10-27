import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { ApiService } from '../../app/api.service';
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
  @Input()

  margin = {top: 20, right: 20, bottom: 30, left: 40};
  // ========================================================

  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
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
          // console.log(this.author_result_obj);
        }
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
  }

  
  setCoauther(value){
    this.coAuthorUrl=value;
    console.log(this.coAuthorUrl);
    this.publicatonUrl='';
    this.coauthbutton='inline';
    this.pubbutton='none';
    createGraph(this.svg, this.data, this.url,this.coAuthorUrl, this.publicatonUrl);
  }
  viewCoauther(){
    this.apiservice.coautherSerach(this.coAuthorUrl).subscribe(data=>{
      for (let index = 0; index < data.length; index++){
        this.coauthSearchData=JSON.parse(data[index])}
      console.log(this.coauthSearchData['_id']['$oid']);
      this.router.navigate(['/auther',this.coauthSearchData['_id']['$oid']]);
    });
  }
  setPublication(value){
    this.publicatonUrl=value;
    this.coAuthorUrl='';
    this.coauthbutton='none';
    this.pubbutton='inline';
    createGraph(this.svg, this.data, this.url,this.coAuthorUrl, this.publicatonUrl);
  }
  usage(){
    console.log('clicked');
  }
  viePub(){
    this.router.navigate(['/publication',this.publicatonUrl]);
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
}
