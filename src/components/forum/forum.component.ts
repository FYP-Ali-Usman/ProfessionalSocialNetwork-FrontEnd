import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { ApiService } from '../../app/api.service';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  constructor(private apiservice: ApiService , private router: Router) { }
  yourFeed:boolean;

  article;
  article2;
  article_response:any=[];
  article_response2:any[]=[];
  article_response3:any[]=[];
  article_response5:any[]=[];
  article_response4:any[]=[];
  article_response_obj:any={};
  artErrorMsg:string='';
  title:string="";
  discription:string="";
  image:string;
  tagText:any="";
  tags:string[];
  tags2:string[];
  tagsJson;
  favourites:number;
  edit_article_id:number;
  editFormArt:any={};
  delFormArt:any={};

  ngOnInit() {
    $('.msg1').css('display', 'none');
    $('#id01').css('display', 'none');
    $('#id02').css('display', 'none');
    $('#loggg').css('display','none');
    if(this.apiservice.loggedIn()!=true)
    {
      $('#loggg').css('display','block')
      $('.allo').css('display','none')
      this.yourFeed=false;
    }else if(this.apiservice.loggedIn()==true){
      $('#loggg').css('display','none')
      $('.allo').css('display','block')
      this.yourFeed=false;}
    // get articlw===============
    this.apiservice.getArticles().subscribe(data=>{
      this.article_response=data;
      for (let i = 0; i < this.article_response.length; i++) {
        this.article_response_obj={id:this.article_response[i].id,title:this.article_response[i].title,discription:this.article_response[i].discription,username:this.article_response[i].user.username,image:this.article_response[i].image,Updated_at:this.article_response[i].Updated_at,tags:JSON.parse(this.article_response[i].tags)};

        this.article_response2.push(this.article_response_obj);    
      }
      this.article_response3=this.article_response2;
      this.article_response2=[];
      console.log(this.article_response3);
    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    })
    // ================================================

  }

  closeModel(){
    $('#id01').css('display', 'none');
  }
  openModel(){
    $('#id01').css('display', 'block');
    window.scroll(0,0);

  }
  closeModel2(){
    $('#id02').css('display', 'none');
    this.title=''
    this.discription=''
    this.tagsJson=''
  }
  openModel2(id){
    $('#id02').css('display', 'block');
    this.edit_article_id=id;
    for (let i = 0; i < this.article_response3.length; i++) {
      if(this.article_response3[i].id==this.edit_article_id){
        this.editFormArt=this.article_response3[i];
      }
    }
    window.scroll(0,0);
  }

  viewComment(id){
    console.log('ddd'+id)
    this.router.navigate(['/postview',id])
  }
  goLog()
  {
    this.router.navigate(['/Login'])
  }
  selected_image:File=null;
  onFileSelected(event){
   console.log(event);
   this.selected_image=<File>event.target.files[0];
   console.log(this.selected_image);
  }
  createArticle(){
    const formData = new FormData();
    $('#id01').css('display', 'none');
    this.tags=this.tagText.split(",");
    this.tagsJson=JSON.stringify(this.tags);
    this.article={title:this.title, discription:this.discription,tags:this.tagsJson}
    formData.append('title', this.article['title']);
    formData.append('discription', this.article['discription']);
    formData.append('tags', this.article['tags']);
    if(this.selected_image!=null){
      formData.append('image', this.selected_image,this.selected_image.name);}
    // console.log(this.article);

    this.apiservice.createArt(formData).subscribe(data=>{
      this.article_response=data;
      // console.log(this.article_response);
      $('.msg1').css('display', 'block');
      this.ngOnInit();
    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    })
    this.selected_image=null;
    this.title='';
    this.discription='';
    this.tagsJson='';
    this.tagText='';
    
    window.scroll(0,0);
  }
  updateArticle(){
    const formData1 = new FormData();
    $('#id02').css('display', 'none');

    if(this.tagText==""){
      console.log(this.editFormArt['tags']);
      this.tags=this.editFormArt['tags'];
      this.tagsJson=JSON.stringify(this.tags);
    }else{
      
      this.tags=this.tagText.split(",");
      console.log(this.tags);
      this.tagsJson=JSON.stringify(this.tags);}

    this.article2={id:this.editFormArt['id'], title:this.title, discription:this.discription,tags:this.tagsJson}
    
    if(this.article2['title']==""){
      this.article2['title']=this.editFormArt['title']
    }
    if(this.article2['discription']==""){
      this.article2['discription']=this.editFormArt['discription']
    }
    
    formData1.append('id', this.article2['id']);
    formData1.append('title', this.article2['title']);
    formData1.append('discription', this.article2['discription']);
    formData1.append('tags', this.article2['tags']);
    if(this.selected_image!=null){
      formData1.append('image', this.selected_image,this.selected_image.name);}
    
    this.apiservice.updateArt(formData1).subscribe(data=>{
      this.article_response=data;
      console.log(this.article_response);
      $('.msg1').css('display', 'block');
      this.get_user_article();
  
    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    });
    this.title='';
    this.discription='';
    this.tagsJson='';
    this.tagText='';
    
    window.scroll(0,0);
  }
  get_user_article(){
    this.apiservice.get_user_articl(this.apiservice.getUserId()).subscribe(data=>{
    console.log(data);
    this.article_response=data;
    for (let i = 0; i < this.article_response.length; i++) {
      this.article_response_obj={id:this.article_response[i].id, title:this.article_response[i].title,discription:this.article_response[i].discription,username:this.article_response[i].user.username,image:this.article_response[i].image,Updated_at:this.article_response[i].Updated_at,tags:JSON.parse(this.article_response[i].tags)};

      this.article_response5.push(this.article_response_obj);    
    }
    this.article_response4=this.article_response5;
    this.article_response5=[];
    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    })
    window.scroll(0,0);
  }
  delete_article(id){
    this.apiservice.deleteArt(id).subscribe(data=>{

    },
    error=>{
        this.artErrorMsg=error.error;
        $('.msg1').css('display', 'block');
        console.log(this.artErrorMsg);
    });
    this.ngOnInit();
    window.scroll(0,0);
    }
  
}
