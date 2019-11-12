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
  sss1:string='none';
  sss2:string='block';
  query;

  movies = [{title: 'titanic'}, {title: 'avatar'}];
  constructor(private api: ApiService, private comp: HeaderComponent,private router: Router) {
  }
  ngOnInit() {
    this.comp.ngOnInit();
    this.query=localStorage.getItem('user_id');
    this.api.getRecommends(this.query).subscribe(datadd => {
      console.log(datadd);
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
  onPress(url: string, name: string) {
    // console.log('working1');
    // console.log(this.search[0]);
    // console.log(this.search[1]);
    // console.log(url);
    // console.log(name)
    if (url && name) {
      this.search[0] = url;
      this.search[1] = name;
    }
    this.api.add_faculty(this.search)
      .subscribe(
        (response) => console.log(response),
        (error) => console.log(error)
      );
      this.router.navigate(['/search']);
  }
  // =============================================================================
  onPress2(){
    this.router.navigate(['/searchfor',this.author]);
  }
  openForum(){
    this.router.navigate(['/forum']);
  }

}
