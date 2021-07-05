import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoggedIn = false ;  
  UserLogginedBy : string;
  UserData: any;
  IsGoogleLogin = false;
  IsFBLogin = false;
  constructor( private router : Router, private tokenStorageService: TokenStorageService ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    console.log('status', this.isLoggedIn);

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.UserData = user;
      const loginby = this.tokenStorageService.getLoginBy();
      console.log(' my user loginned by - ',loginby);
      console.log(' my user info - ',this.UserData);
      this.UserLogginedBy = loginby;
      if(this.UserLogginedBy == 'fb'){
        this.IsFBLogin = true;
        this.IsGoogleLogin = false;
        console.log('*******************');
        console.log('This is fb profile');
        console.log('*******************');
      }else if (this.UserLogginedBy == 'google') {
        this.IsFBLogin = false;
        this.IsGoogleLogin = true;
        console.log('*******************');
        console.log('This is google profile');
        console.log('*******************');
      }
    }else {
      this.router.navigateByUrl('');
    }
  }




  // Session clearing
  logout(): void {
    window['FB'].logout(function(response) {
      // Person is now logged out
      alert('The Person was Logout Successfully');
 
   });
   this.tokenStorageService.signOut();
   window.location.reload();
    
  }

  signout(): void {
    window.location.assign('https://accounts.google.com/Logout');
    this.tokenStorageService.signOut();
    window.location.reload();
    
  }
}
