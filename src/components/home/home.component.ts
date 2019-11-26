import { Component,ViewChild, OnInit  } from '@angular/core';
import { ApiService } from '../../app/api.service';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';

@Component({
  providers:[HeaderComponent],
  selector: 'home-component',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  search = ['', ''];
  author:any='';
  hhh;
  hhh2;
  sss1:string='none';
  sss2:string='block';
  query;
  recommendations=[];
  recommendations2=[];
  count;
  count1;


  movies = [{title: 'titanic'}, {title: 'avatar'}];
  constructor(private api: ApiService, private comp: HeaderComponent,private router: Router) {
  }
  ngOnInit() {
    this.recommendations=[]
    this.recommendations2=[]
    this.comp.ngOnInit();
    this.query=localStorage.getItem('user_id');
    this.api.getRecommends(this.query).subscribe(datadd => {
      console.log(datadd);
      this.count=Math.ceil(datadd.length/2);
      this.count1=datadd.length-this.count;

      for (let index = 0; index < this.count; index++) {
        this.recommendations.push(datadd[index]);
      }
      for (let index1 = this.count; index1 < datadd.length; index1++) {
        this.recommendations2.push(datadd[index1]);
      }
      
      console.log(this.recommendations);
      console.log(this.recommendations2);

    },error=>{
      console.log(error);
    }
    );

  }
  ss1(){
    this.sss1='block';
    this.sss2='none';
  }
  ss2(){
    this.sss1='none';
    this.sss2='block';
  }
  openPub(id){
    this.router.navigate(['/publication',id]);
  }

  // =============================================================================
  onPress2(){
    this.router.navigate(['/searchfor',this.author]);
  }
  openForum(){
    this.router.navigate(['/forum']);
  }
  searchCatttt(catt){
    this.router.navigate(['/searchfor',catt]);
  }

}
