import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Injectable()
  /*
  HttpInterceptor is the interface provided by angular that forces you to implement the intercept method so that we can call this method for request that are leaving second argument next allow to leave the request and allow other part of our application to execute and is of type http handler also provided by http module of angular
  */
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: ApiService, private router: Router) { }
  // In order to make this interceptor work we have to provide it as a service but bit differently by adding an javascript object to provider array in app.module.ts
  token:string;
  token2:string;
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.token = this.authService.getToken();
    // clone method is used to make the copy of the request and we can also edit request via clone
    console.log('ssss'+this.token);
    if(this.router.url!=='/Login' && this.token!==undefined && this.token!=""){
      return next.handle(
        req.clone({
          headers: req.headers.append('Authorization', 'JWT ' + this.token)
        })
      );
    }
    else if(this.authService.loggedIn() == true){
      this.token2=localStorage.getItem('access_token');
      console.log(this.token2);
      return next.handle(
        req.clone({
          headers: req.headers.append('Authorization', 'JWT ' + this.token2)
        })
      );
    }

    // req.clone({
    //   headers: req.headers.append('Content-Type', 'application/json; charset=utf-8')
    // })
    // req.clone({
    //   headers: req.headers.append('Accept', 'application/json')
    // })
    
    return next.handle(req);}
}
