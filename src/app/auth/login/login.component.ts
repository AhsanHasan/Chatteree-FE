import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from 'firebase/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private angularAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  onGoogleSignIn(): void {
    this.angularAuth.signInWithPopup(new GoogleAuthProvider()).then((userCredential) => {
      console.log(userCredential);
    }).catch((error) => {
      console.error(error);
    });
  }

}
