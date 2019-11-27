import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
import { json } from 'd3';
@Component({
  selector: 'app-other-search',
  templateUrl: './other-search.component.html',
  styleUrls: ['./other-search.component.css']
})
export class OtherSearchComponent implements OnInit {
  author_result:any=[];
  author_result_j:any=[];
  author_result2:any=[];
  author_result_obj:any={};

  author_resulty:any=[];
  author_resulty_j:any=[];
  author_result2y:any=[];
  author_result_objy:any={};

  pub_result:any=[];
  pub_result_j:any=[];
  pub_result2:any=[];
  pub_result_obj:any={};

  author:any='';
  loading:string='block';
  seco:string='none';
  llod:string='block';
  fir:string='block';
  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }
  query;
  bbbb;
  crawAllow;
  showLoad:string;
  pubLength:any;
  authLength:any;
  ngOnInit() {
    this.author_result_j=[];
    this.author_resulty_j=[];
    this.pub_result_j=[];
    this.author_result2y=[];
    this.pubLength=0;
    this.authLength=0;
    this._Activatedroute.params.subscribe(queryParams => {
      console.log(queryParams);
      this.query=queryParams.author;
      console.log(this.query);
      this.author_result_j=[];
      this.author_resulty_j=[];
      this.pub_result_j=[];
      this.author_result2y=[];
        // ("author");
    this.apiservice.searchAuther(this.query).subscribe(data=>{
      console.log(data);
      console.log(data['rauthor'])
      this.author_result=[];
      console.log(data['rpublications'])
      this.author_result_j=data['rauthor']
      this.authLength=this.author_result_j.length;
      for (let index = 0; index < this.author_result_j.length; index++) {
        this.author_result_obj=JSON.parse(this.author_result_j[index]);
        this.author_result.push(this.author_result_obj);        
      }
      this.author_result2=this.author_result; 
      console.log(this.author_result2);
      if(this.author_result2.length==0){
        this.fir='none';
      }
      this.loading='none';
      // ====================================
      // console.log(data['rpublications'])
      this.pub_result=[];
      
      this.pub_result_j=data['rpublications']
      this.pubLength=this.pub_result_j.length;
      for (let index = 0; index < this.pub_result_j.length; index++) {
        this.pub_result_obj=JSON.parse(this.pub_result_j[index]);
        this.pub_result.push(this.pub_result_obj);        
      }
      this.pub_result2=this.pub_result; 
      console.log(this.pub_result2);
      this.loading='none';
      // ===============================
      this.crawAllow=data['crawl'];
      if(this.crawAllow=='crawlAgain'){
        this.apiservice.searchAutherYeild(this.query).subscribe(data=>{
          // console.log(data['rauthor'])
          this.author_resulty=[];
          this.author_resulty_j=data['rauthor']
          console.log(data['rauthor']);
          this.authLength+=this.author_resulty_j.length;
          for (let index = 0; index < this.author_resulty_j.length; index++) {
            this.author_result_objy=JSON.parse(this.author_resulty_j[index]);
            if(this.author_result_objy['_id']['$oid']!==this.author_result_obj['_id']['$oid']){
            this.author_resulty.push(this.author_result_objy);}        
          }
          this.author_result2y=this.author_resulty; 
          console.log(this.author_result2y);
          this.loading='none';
          this.llod='none';
          this.seco='block';
        });
      }
      else if(this.crawAllow=='crawlAgainNot')
      {
        this.loading='none';
        this.llod='none';
        this.seco='none';
        this.author_result2y=[]
      }
      // =============================
    });
  });
  }


  viewAuthor(id){
    this.router.navigate(['/auther',id['$oid']]);
  }
  openPub(id){
    this.router.navigate(['/publication',id['$oid']]);
  }
  onPress2(){
    this.loading='block';
    this.router.navigate(['/searchfor',this.author]);
    this.loading='none';
    // this.apiservice.searchAuther(this.author).subscribe(data=>{
    //   this.author_result=[];
    //   for (let index = 0; index < data.length; index++) {
    //     this.author_result_obj=JSON.parse(data[index]);
    //     this.author_result.push(this.author_result_obj);        
    //   }
    //   this.author_result2=this.author_result; 
    //   console.log(this.author_result2);
    //   this.loading='none';
    // });
  }
  // done ====================
  searchCat(cat){
    this.router.navigate(['/searchfor',cat]);
  }
// ===================
}
