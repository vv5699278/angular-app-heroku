import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('loginRef', {static: true }) loginElement: ElementRef;

  isLoggedIn = false;
  auth2: any;


  constructor( private router : Router, private tokenStorage : TokenStorageService, private zone: NgZone) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorage.getToken();
    console.log('login status', this.isLoggedIn);

    if (this.isLoggedIn) {
      this.router.navigateByUrl('profile');
    }else {
      this.fbLibrary();
      this.googleSDK();
    }
  
  }

  // Google Login

  prepareLoginButton() {
 
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
   
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
        this.tokenStorage.saveToken(googleUser.getAuthResponse().id_token);
        let userInfo = {
          "Name" : profile.getName(),
          "Image" :  profile.getImageUrl(),
          "Email" : profile.getEmail()
        };
        console.log(' my google user - ', userInfo);
        this.tokenStorage.saveUser(userInfo);
        this.tokenStorage.saveLoginBy('google');
        this.zone.run(() => {
          this.router.navigate(['/profile']);
      });
   
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
   
  }

  googleSDK() {
 
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '134000737307-7cl9fqoksi6gmbavr6v7mab15fob570s.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    }
   
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
   
  }


  // FaceBook Login

  fbLibrary() {
 
    (window as any).fbAsyncInit = function() {
      window['FB'].init({
        appId      : '1413474222356637',
        cookie     : true,
        xfbml      : true,
        version    : 'v3.1'
      });
      window['FB'].AppEvents.logPageView();
    };
 
    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
 
  }

  login() : void { 

    window['FB'].login((response) => {
        console.log('login response',response);
        console.log('login token',response.authResponse.accessToken);
        if (response.authResponse) {

          this.tokenStorage.saveToken(response.authResponse.accessToken);

          window['FB'].api('/me', {
            fields: 'last_name, first_name, email, birthday, hometown, gender, location, age_range'
          }, (userInfo) => {
 
            console.log("user information");
            console.log(userInfo);
            this.tokenStorage.saveUser(userInfo);
            this.tokenStorage.saveLoginBy('fb');
            // this.router.navigateByUrl('profile');
            this.zone.run(() => {
              this.router.navigate(['/profile']);
          });
          });
           
        } else {
          console.log('User login failed');
        }
    }, {scope: 'email, user_birthday, user_hometown, user_gender, user_location, user_age_range'});
  }

}
