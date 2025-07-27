import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isloading = false;
  constructor() {}
  signupUser(formValue: any) {
    console.log('User signed up with:', formValue);
  }

  ngOnInit(): void {
  }

}
