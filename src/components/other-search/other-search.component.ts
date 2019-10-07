import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
@Component({
  selector: 'app-other-search',
  templateUrl: './other-search.component.html',
  styleUrls: ['./other-search.component.css']
})
export class OtherSearchComponent implements OnInit {
  author_result:any=[];
  author_result2:any=[];
  author_result_obj:any={};
  author:any='';
  loading:string='block';
  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }
  query;
  showLoad:string;
  ngOnInit() {
    this.query=this._Activatedroute.snapshot.paramMap.get("author");
    this.apiservice.searchAuther(this.query).subscribe(data=>{
      this.author_result=[];
      for (let index = 0; index < data.length; index++) {
        this.author_result_obj=JSON.parse(data[index]);
        this.author_result.push(this.author_result_obj);        
      }
      this.author_result2=this.author_result; 
      console.log(this.author_result2);
      this.loading='none';
    });
  }
  viewAuthor(id){
    this.router.navigate(['/auther',id['$oid']]);
  }
  onPress2(){
    this.loading='block';
    this.router.navigate(['/searchfor',this.author]);
    this.apiservice.searchAuther(this.author).subscribe(data=>{
      this.author_result=[];
      for (let index = 0; index < data.length; index++) {
        this.author_result_obj=JSON.parse(data[index]);
        this.author_result.push(this.author_result_obj);        
      }
      this.author_result2=this.author_result; 
      console.log(this.author_result2);
      this.loading='none';
    });
  }

}
