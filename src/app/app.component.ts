import { Component, OnInit } from '@angular/core';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [ApiService]
})
export class AppComponent implements OnInit {

  ngOnInit() {
  }
}
