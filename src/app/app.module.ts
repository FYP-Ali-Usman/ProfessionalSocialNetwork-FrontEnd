import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './../components/home/home.component';
import { HeaderComponent } from '../components/header/header.component';
import { FooterComponent } from '../components/footer/footer.component';
import { SingupComponent } from '../components/singup/singup.component';
import {LoginComponent} from '../components/login/login.component';
import {ForumComponent} from '../components/forum/forum.component';
import {PostviewComponent} from '../components/postview/postview.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';
import {AfterSearchComponent} from '../components/after-search/after-search.component';
import {OtherSearchComponent} from '../components/other-search/other-search.component';
import {AuthViewComponent} from '../components/auth-view/auth-view.component';
import {PubViewComponent} from '../components/pub-view/pub-view.component';
import {ProfileViewComponent} from '../components/profile-view/profile-view.component';
import {FavouritesComponent} from '../components/favourites/favourites.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FileUploadModule} from 'ng2-file-upload';
// import { NgbCarousel} from '@ng-bootstrap/ng-bootstrap';
// import { MatIconModule } from '@angular/material/icon';

import { AuthInterceptor } from './auth/auth-interceptor';
import { AuthGuard } from './auth/auth.guard';


const appRoutes: Routes = [
  {path: '' , component: HomeComponent},
  {path: 'Singup' , component: SingupComponent},
  {path: 'Login' , component: LoginComponent},
  {path: 'Home', component:HomeComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'forum', component:ForumComponent},
  {path: 'postview/:id', component:PostviewComponent},
  {path: 'search', component:AfterSearchComponent},
  {path: 'searchfor/:author', component:OtherSearchComponent},
  {path: 'auther/:id', component:AuthViewComponent},
  {path: 'publication/:id', component:PubViewComponent},
  {path: 'profile/:id', component:ProfileViewComponent},
  {path: 'favourites', component:FavouritesComponent},

];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FavouritesComponent,
    SingupComponent,
    LoginComponent,
    FooterComponent,
    ProfileComponent,
    ForumComponent,
    PostviewComponent,
    AfterSearchComponent,
    OtherSearchComponent,
    AuthViewComponent,
    PubViewComponent,
    ProfileViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    NgbModule,
    FormsModule,
    FileUploadModule,
    MDBBootstrapModule.forRoot(),
    NgbModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ],
  providers: [ApiService, AuthGuard , { provide: HTTP_INTERCEPTORS , useClass: AuthInterceptor , multi: true }],
  bootstrap: [AppComponent]
})
  //  HTTP_INTERCEPTORS is an token identifier module
export class AppModule { }
