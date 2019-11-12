import { Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { ApiService } from '../../app/api.service';

@Component({
  selector: 'app-pub-view',
  templateUrl: './pub-view.component.html',
  styleUrls: ['./pub-view.component.css']
})
export class PubViewComponent implements OnInit {
  query:any;
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
  author_result_obj:any={};
  pub_result:any=[];
  pub_result_obj:any={};
  recommendPub={}
  hhh;
  hhh2;
  user_id;
  dprofile={};
  allowAdd:boolean=true;
  pubRecommend=[]
  pubRecommendObj={}
  profile;
  response_user;
  error_msg;
  constructor(private apiservice: ApiService , private router: Router, private _Activatedroute:ActivatedRoute) { }

  ngOnInit() {
    this._Activatedroute.params.subscribe(queryParams => {
    console.log(queryParams);
    this.query=queryParams.id;
    console.log(this.query);
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
// ================================================articles
      this.apiservice.getPubArticles(this.query).subscribe(data=>{
        console.log(data)
        if(data.length==0){
          $('#postss').css('display', 'none');
        }
        this.article_response=data;
        for (let i = 0; i < this.article_response.length; i++) {
          this.article_response_obj={id:this.article_response[i].id,title:this.article_response[i].title,discription:this.article_response[i].discription,username:this.article_response[i].user.username,image:this.article_response[i].image,Updated_at:this.article_response[i].Updated_at,tags:JSON.parse(this.article_response[i].tags)};
          // this.article_response_obj=JSON.parse(this.article_response[i]);
          console.log(this.article_response_obj)
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
      });
      // ====================publication============
      this.apiservice.onePubSerach(this.query).subscribe(data=>{
        this.pub_result=[];
        for (let index = 0; index < data.length; index++) {
          this.pub_result_obj=JSON.parse(data[index]);
          
          this.pub_result.push(this.pub_result_obj);
          }
          console.log(this.pub_result);
          if(this.apiservice.loggedIn() == true){
            // ===
            this.user_id=this.apiservice.getUserId();
            this.apiservice.getProfile(this.user_id).subscribe(datadd => {
              console.log('profile retrieved');
              const kkk = datadd;
              this.dprofile=kkk;
              console.log(this.dprofile);
              this.pubRecommend=JSON.parse(this.dprofile['pubInterest']);
              if(this.pubRecommend!=null && this.pubRecommend!=undefined){
                
                for (let index = 0; index < this.pubRecommend.length; index++) {
                  if(this.pubRecommend[index]['id']==this.pub_result_obj['_id']['$oid']){
                    this.pubRecommend[index]['respect']=this.pubRecommend[index]['respect']+1;
                    this.allowAdd=false;
                    break;
                  }
                }
                if(this.allowAdd==true){
                  this.pubRecommendObj={id:this.pub_result_obj['_id']['$oid'],respect:1}
                  this.pubRecommend.push(this.pubRecommendObj);
                }
              }
              else{
                console.log(this.pub_result_obj);
                this.pubRecommend=[];
                this.pubRecommendObj={id:this.pub_result_obj['_id']['$oid'],respect:1}
                this.pubRecommend.push(this.pubRecommendObj);
              }
              console.log(JSON.stringify(this.pubRecommend));
              this.onRecomend(this.pubRecommend,this.dprofile);
              
            },error=>{
              console.log(error);
            }
            );
            // ===
      
          }
        });
      // ==============================================

      // ==============recomened========================
      this.apiservice.recommend(this.query).subscribe(data=>{
        this.recommendPub=data;
        if(this.recommendPub['notSameAuthor'].length==0){
          this.hhh2='10px';
        }
        else if(this.recommendPub['notSameAuthor'].length==1){
          this.hhh2='200px';
        }
        else{
          this.hhh2='550px';
        }

        if(this.recommendPub['sameAuthor'].length==0){
          this.hhh='10px';
        }
        else if(this.recommendPub['sameAuthor'].length==1){
          this.hhh='200px';
        }
        else{
          this.hhh='550px';
        }
        console.log(data)
        });
      // =======================================
        // ==============================================================
        
        
        this.pubRecommend=[]
        this.pubRecommendObj={}
      
    });
  }

  goLog()
  {
    this.router.navigate(['/Login'])
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
  }
  viewComment(id){
    console.log('ddd'+id)
    this.router.navigate(['/postview',id])
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
    this.article={title:this.title, discription:this.discription,tags:this.tagsJson,paperId:this.query}
    formData.append('title', this.article['title']);
    formData.append('discription', this.article['discription']);
    formData.append('tags', this.article['tags']);
    formData.append('paperId', this.article['paperId']);
    if(this.selected_image!=null){
      formData.append('image', this.selected_image,this.selected_image.name);}
    // console.log(this.article);

    this.apiservice.createArt(formData).subscribe(data=>{
      this.article_response=data;
      // console.log(this.article_response);
      $('.msg1').css('display', 'block');
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
    this.ngOnInit();
    window.scroll(0,0);
  }

  // ===============================update delete=====================================
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

    this.article2={id:this.editFormArt['id'], title:this.title, discription:this.discription,tags:this.tagsJson,paperId:this.query}
    
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
    formData1.append('paperId', this.article['paperId']);
    if(this.selected_image!=null){
      formData1.append('image', this.selected_image,this.selected_image.name);}
    
    this.apiservice.updateArt(formData1).subscribe(data=>{
      this.article_response=data;
      console.log(this.article_response);
      $('.msg1').css('display', 'block');
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
    onRecomend(recommend,profile){
      const formData = new FormData();
      this.profile = {id:profile['id'],typeOf:profile['typeOf'],organization:profile['organization'],about:profile['about'],pubInterest:JSON.stringify(recommend)}
      console.log(this.profile);
      
      formData.append('id', this.profile['id']);
      formData.append('pubInterest', this.profile['pubInterest']);
      formData.append('typeOf', this.profile['typeOf']);
      formData.append('organization', this.profile['organization']);
      formData.append('about', this.profile['about']);
      console.log(formData);
      this.apiservice.updateProfile(formData).subscribe(data => {
        $('.msg2').css('visibility', 'visible');
        console.log('profile updated');
        console.log(data);
        this.response_user = data;
        $('.msg1').css('visibility', 'hidden');
      },error=>{
        console.log(error);
        $('.msg1').css('visibility', 'visible');
        this.error_msg = error.error;
      }
      );
  
      this.pubRecommend = [];
    }
}
