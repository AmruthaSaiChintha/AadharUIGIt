import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { EmailpageComponent } from './emailpage/emailpage.component';
import { ViewpageComponent } from './viewpage/viewpage.component';
import { DetailsComponent } from './details/details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UpdateComponent } from './update/update.component';
import { ImageComponent } from './image/image.component';
import { UsersComponent } from './users/users.component';
import { CreateupdateComponent } from './createupdate/createupdate.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AllusersComponent } from './allusers/allusers.component';
import { LeftComponent } from './left/left.component';
import { NewUserComponent } from './new-user/new-user.component';
import { ViewpageidComponent } from './viewpageid/viewpageid.component';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AadharpageComponent } from './aadharpage/aadharpage.component';
import { SignupComponent } from './signup/signup.component';
import { FooterComponent } from './footer/footer.component';
import { LogoutComponent } from './logout/logout.component';
import { HeaderComponent } from './header/header.component';
import { UpdatenewComponent } from './updatenew/updatenew.component';
import { HomepageComponent } from './homepage/homepage.component';
import { OptionsComponent } from './options/options.component';
import { Login1Component } from './login1/login1.component';
import { Signup1Component } from './signup1/signup1.component';
@NgModule({
  declarations: [
    AppComponent,
    LandingpageComponent,
    EmailpageComponent,
    DetailsComponent,
    ViewpageComponent,
    UpdateComponent,
    ImageComponent,
    UsersComponent,
    CreateupdateComponent,
    ContactusComponent,
    AllusersComponent,
    LeftComponent,
    NewUserComponent,
    ViewpageidComponent,
    LoginComponent,
    AadharpageComponent,
    SignupComponent,
    FooterComponent,
    LogoutComponent,
    HeaderComponent,
    UpdatenewComponent,
    HomepageComponent,
    OptionsComponent,
    Login1Component,
    Signup1Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  
    ReactiveFormsModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
      tokenGetter: () => {
        return localStorage.getItem('access_token');
      },
      allowedDomains: ['localhost:44348'],
      },
    }),
    BrowserAnimationsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
