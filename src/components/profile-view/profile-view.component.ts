import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css']
})
export class ProfileViewComponent implements OnInit {
  query;
  dprofile={};
  duser = {};
  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.params.subscribe(queryParams => {
      console.log(queryParams);
      this.query=queryParams.id;
      console.log(this.query);

      this.apiservice.getUser(this.query).subscribe(datadd => {
        console.log('profile retrieved');
        const kkkk = datadd;
        this.duser=kkkk;
  
      },error=>{
        console.log(error);
      }
      );

      this.apiservice.getProfile(this.query).subscribe(datadd => {
        console.log('profile retrieved');
        const kkk = datadd;
        this.dprofile=kkk;
        // this.dprofile['image']='http://127.0.0.1:8000/media/'+kkk['image'];
        console.log(this.dprofile);
      },error=>{
        console.log(error);
      }
      );
    });

  }

}
