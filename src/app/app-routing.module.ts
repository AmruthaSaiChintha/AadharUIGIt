import { Component, createComponent, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { combineLatestInit } from 'rxjs/internal/observable/combineLatest';
import { DetailsComponent } from './details/details.component';
import { EmailpageComponent } from './emailpage/emailpage.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ViewpageComponent } from './viewpage/viewpage.component';
import { UpdateComponent } from './update/update.component';
import { ImageComponent } from './image/image.component';
import { UsersComponent } from './users/users.component';
import { CreateupdateComponent } from './createupdate/createupdate.component';
import { ContactusComponent } from './contactus/contactus.component';
import { AllusersComponent } from './allusers/allusers.component';
import { LeftComponent } from './left/left.component';
import { NewUserComponent } from './new-user/new-user.component';
import { ViewpageidComponent } from './viewpageid/viewpageid.component';
import { LoginComponent } from './login/login.component';
import { AadharpageComponent } from './aadharpage/aadharpage.component';
import { SignupComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { HeaderComponent } from './header/header.component';
import { authorizationguard } from './authorization.guard';
import { UpdatenewComponent } from './updatenew/updatenew.component';
import { OptionsComponent } from './options/options.component';

import { OtpComponent } from './otp/otp.component';
import { AuthenticationGuard } from './authentication.guard';


const routes: Routes = [

{path:"",component:LandingpageComponent},
{path:"landingpage",component:LandingpageComponent},
{path:"emailpage",component:EmailpageComponent},  
{path:"viewpage/:aadharNumber",component:ViewpageComponent},
{path:"details",component:DetailsComponent},
{path:"update/:id", component:UpdateComponent},
{path:"image",component:ImageComponent},
{path:"users",component:UsersComponent,canActivate:[authorizationguard]},
{path:"createupdate",component:CreateupdateComponent},
{path:"contactus",component:ContactusComponent},
{path:"allusers",component:AllusersComponent,canActivate:[authorizationguard]},
{path:"left",component:LeftComponent},
{ path:"newUser", component:NewUserComponent, canActivate:[AuthenticationGuard]},
{path:"viewpageid/:id",component:ViewpageidComponent},
{path:"login",component:LoginComponent},
{path:"aadharpage",component:AadharpageComponent},
{path:"signup",component:SignupComponent},
{path:"logout",component:LogoutComponent},
{path:"header",component:HeaderComponent},
{path:"updatenew/:id",component:UpdatenewComponent},
{path:"options",component:OptionsComponent},


{path:"otp",component:OtpComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
