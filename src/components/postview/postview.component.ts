import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
@Component({
  selector: 'app-postview',
  templateUrl: './postview.component.html',
  styleUrls: ['./postview.component.css']
})
export class PostviewComponent implements OnInit {

  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }
  id;
  article;
  article_response:any=[];
  article_response2:any[]=[];
  article_response3:any={};
  article_response5:any[]=[];
  article_response4:any[]=[];
  article_response_obj:any={};
  artErrorMsg:string='';
  title:string;
  discription:string;
  image:string;
  tagText:string;
  tags:string[];
  tags2:string[];
  tagsJson;
  favourites:number;

  comment;
  comment_response:any=[];
  comment_response2:any[]=[];
  comment_response3:any[]=[];
  comment_response_obj:any={};
  comErrorMsg:string='';
  body:string;
  image2:string;


  ngOnInit() {
    $('.msg1').css('display', 'block');
    this.id=this._Activatedroute.snapshot.paramMap.get("id");
    console.log(this.id);

    // get articlw===============
    this.apiservice.getArticle(this.id).subscribe(data=>{
      
      this.article_response.push(data);
      for (let i = 0; i < this.article_response.length; i++) {
        this.article_response_obj={id:this.article_response[i].id,title:this.article_response[i].title,discription:this.article_response[i].discription,username:this.article_response[i].user.username,image:this.article_response[i].image,Updated_at:this.article_response[i].Updated_at,tags:JSON.parse(this.article_response[i].tags)};

        this.article_response2.push(this.article_response_obj);    
      }
      this.article_response3=this.article_response2[0];
      this.article_response2=[];
    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    })
    // ================================================

    // GET COMMENT
    this.apiservice.getComments(this.id).subscribe(data=>{
      
      this.comment_response=data;
      console.log(this.comment_response);
    },
    error=>{
        this.comErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    })
    // ==========================================================

  }
  goLog(){
    this.router.navigate(['/Login']);
  }
  selected_image:File=null;
  onFileSelected(event){
   console.log(event);
   this.selected_image=<File>event.target.files[0];
   console.log(this.selected_image);
  }
  createComment(){
    const formData = new FormData();
    $('#id01').css('display', 'none');
    this.comment={body:this.body,article_id:this.id}
    formData.append('body', this.comment['body']);
    formData.append('article_id', this.comment['article_id']);
    if(this.selected_image!=null){
      formData.append('image', this.selected_image,this.selected_image.name);}
    console.log(this.comment);
    this.apiservice.createCom(formData).subscribe(data=>{
      this.comment_response2=data;
      console.log(this.comment_response2);
      $('.msg1').css('display', 'block');
      this.ngOnInit();
    },
    error=>{
        this.comErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.comErrorMsg);
    })

  }


}
