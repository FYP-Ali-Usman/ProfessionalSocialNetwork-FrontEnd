import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import { Router } from '@angular/router';
import { HeaderComponent } from '../components/header/header.component';
import { JsonPipe } from '@angular/common';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private total = new Subject<number>();
  private token: string = "";
  private userId: number =0;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  message: string;
  mage: string = "";
  user_json: any;
  user_json2: any;
  user_json3: any;
  user_json4: any;
  user_json5: any;
  public login_result:any;
  user:object={};
  profile;
  data:object={};
  art_id:any={};
  article;
  comment;

  constructor(private http: HttpClient, private router: Router) {}
  /** POST: add a new hero to the database */
  add_faculty(search: any[]) {
    // console.log('working2');
    // console.log(search[0]);
    // console.log(search[1]);
    return this.http.post('http://127.0.0.1:8000/scrape/bigsearch', search);
  }

  extend_faculty(extend: any[]) {
    console.log(extend);
    return this.http.post("http://127.0.0.1:8000/scrape/singleSearch", extend);
  }

  // auth related , account related stuff-------------------------------------------------------
  getToken() {
    if (this.token === undefined) {
      this.token = "";
    }
    return this.token;
  }

  getUser(id3){
    const headers5 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get<User[]>("http://127.0.0.1:8000/api/auth/update/", {params:{id:id3}});
  }
  getProfile(id3){
    const headers5 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.get<Profile[]>("http://127.0.0.1:8000/profile/", {params:{id:id3}});
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  loggedIn(): boolean{
    return localStorage.getItem('access_token') !==  null;
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getTotalListener() {
    return this.total.asObservable();
  }
  getUserId() {
    return +localStorage.getItem('user_id');
  }

// ==================================================================================
  addUser(user): Observable<User[]> {
    this.user_json = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    return this.http.post<User[]>("http://127.0.0.1:8000/api/auth/register/", this.user_json,{headers: headers});
  }
  addProfile(token, profile_data){
    const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
    this.user_json2 = JSON.stringify(profile_data);
    console.log('JWT '+String(token.token));
    this.token = token.token;
        if (this.token === undefined) {
          this.token = "";
        }
        console.log(this.token.length);
        if (this.token.length <= 22) {
          this.message = this.token;
          this.token = undefined;
          // return this.message;
        } else {
          if (this.token != undefined && this.token != "") {
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
          }
        }
    
    return this.http.post<Profile[]>("http://127.0.0.1:8000/profile/", this.user_json2,{headers: headers});
  }

// ==================================================================================
verifyUser(user) {
  this.http
    .post<{ token: string; id: any; username:string; first_name:string; last_name:string;email:string;}>(
      "http://127.0.0.1:8000/api/auth/",
      user
    )
    .subscribe(
      result => {
        this.user=result;
        console.log(result);
        console.log(result.token);
        this.token = result.token;
        if (this.token === undefined) {
          this.token = "";
        }
        console.log(this.token.length);
        if (this.token.length <= 22) {
          this.message = this.token;
          this.token = undefined;
          // return this.message;
        } else {
          if (this.token != undefined && this.token != "") {
            localStorage.setItem('access_token', this.token);
            this.token = ""
            this.isAuthenticated = true;
            this.userId = result.id;
            localStorage.setItem('user_id', this.userId.toString());
            this.authStatusListener.next(true);
          }
          this.router.navigate(["/"]);
          // return this.message;
        }
        // console.log(this.message);
      },
      err => {
        if (err) {
          this.login_result=err.error[0];
          console.log(err.error[0]);
        }
      },
      () => {
        console.log("complete");
      }
    );
}
get_res()
{
  return this.login_result;
}

updateUser(user): Observable<User[]> {
  this.user_json3 = JSON.stringify(user);
  const headers3 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.put<User[]>("http://127.0.0.1:8000/api/auth/update/", this.user_json3,{headers: headers3});
}
updateProfile(profile): Observable<Profile[]> {
  this.user_json4 = JSON.stringify(profile);
  const headers2 = new HttpHeaders().set('Content-Type', 'multipart/form-data');
  return this.http.put<Profile[]>("http://127.0.0.1:8000/profile/u/", profile);
}

// ==================ARTICLE================================================

createArt(article):Observable<Article[]>{
  // this.article = JSON.stringify(article);
  const headers2 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.post<Article[]>("http://127.0.0.1:8000/forum/article/", article);
}
getArticles(){
  const headers3 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<Article[]>("http://127.0.0.1:8000/forum/article/",{headers: headers3});
}
getPubArticles(id3){
  const headers5 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<Article[]>("http://127.0.0.1:8000/forum/article/pi", {params:{id:id3}});
}
getArticle(id3){
  const headers3 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<Article[]>("http://127.0.0.1:8000/forum/article/",{params:{id:id3}});
}
get_user_articl(id3){
  const headers5 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<Article[]>("http://127.0.0.1:8000/forum/article/ui", {params:{id:id3}});
}
updateArt(art):Observable<Article[]>{
  // this.article = JSON.stringify(art);
  console.log('ksjsjsjsjsjsjsj');
  const headers2 = new HttpHeaders().set('Content-Type', 'multipart/form-data');
  return this.http.put<Article[]>("http://127.0.0.1:8000/forum/article/",art);
}
deleteArt(id3):Observable<any[]>{
  this.art_id = JSON.stringify({id:id3});
  return this.http.delete<any[]>("http://127.0.0.1:8000/forum/article/",{params:{id:id3}});
}
// ===================================================

// ========================COMMENT======================
getComments(id3){
  const headers3 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.get<Article[]>("http://127.0.0.1:8000/forum/comment/ui",{params:{id:id3}});
}
createCom(com):Observable<Comment[]>{
  this.comment = JSON.stringify(com);
  const headers2 = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  return this.http.post<Comment[]>("http://127.0.0.1:8000/forum/comment/", com);
}

// =====================================================

// =================================crawl search=======================================
searchAuther(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/search/authSearch",{params:{name:id3}});
}
searchAuther2(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/search/oneSearch",{params:{id:id3}});
}
searchPub(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/search/apubSearch",{params:{id:id3}});
}
coautherSerach(urll):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/search/coauth",{params:{url:urll}});
}
onePubSerach(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/search/onePub",{params:{id:id3}});
}
recommend(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/recommend",{params:{id:id3}});
}
// =========================================================================

// =========================================
getNewtork(a,b){
  return this.http.get('http://127.0.0.1:8000/graph/entity', {
    params: {
      nodeId: a,
      affiliation: b,
      expand: false
    }
  });
}
expandNetwork(authorURL, organization):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/graph/entity",{
    params:{
      nodeId: authorURL,
      affiliation: organization,
      expand: true
    }
  });
}
// ===============================================================

getRecommends(id3):Observable<any[]>{
  return this.http.get<any[]>("http://127.0.0.1:8000/recommend/advance",{params:{id:id3}});
}
// ====================================================
}



export interface User {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  rpassword: string;
  message: string;
  token: string;
}
export interface Profile {
  id:any;
  image: string;
  phone: number;
  typeOf: string;
  organization: string;
  about: string;
}
export interface Article{
  id:any;
  title:string;
  discription:string;
  tags:any;
  image:string;
  favourites:number;
}
export interface Comment{
  id:any;
  image:string;
  body:string;
}
export interface SearchjAuth{
  id:any
}