import { Component,ViewChild, OnInit  } from '@angular/core';
import { ApiService } from '../../app/api.service';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-after-search',
  templateUrl: './after-search.component.html',
  styleUrls: ['./after-search.component.css']
})
export class AfterSearchComponent implements OnInit {
  search = ['', ''];
  loading;
  constructor(private apiservice: ApiService , private router: Router) { }

  ngOnInit() {
    this.loading='none';
  }
  onPress(url: string, name: string) {
    this.loading='block';
    // console.log('working1');
    // console.log(this.search[0]);
    // console.log(this.search[1]);
    // console.log(url);
    // console.log(name)
    if (url && name) {
      this.search[0] = url;
      this.search[1] = name;
    }
    this.apiservice.add_faculty(this.search)
      .subscribe(
        (response) => {console.log(response)
          this.loading='none';},
        (error) =>{ console.log(error)}
        
      );
  }
}
