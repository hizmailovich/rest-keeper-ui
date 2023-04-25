import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../service/AuthApiService';
import Cookies from 'universal-cookie';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.pattern(/.+@.+\.[a-zA-Z0-9]+/i), Validators.required]),
    password: new FormControl('', [Validators.required])
  })

  constructor(private authApi: AuthApiService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmitForm() {
    this.authApi
      .login(this.loginForm)
      .subscribe({
        next: (res) => {
          localStorage.removeItem('userId')
          localStorage.removeItem('roleName')
          const cookies = new Cookies();
          cookies.set('access', res.accessToken, { path: '/', expires: new Date(Number(res.expTime)) });
          localStorage.setItem('userId', res.userId);
          localStorage.setItem('roleName', res.roleName);
          this.router.navigate(['/profile']);
          alert("user logged in");
        },
        error: (response) => {
          if (response.status === 400 || response.status === 401 || response.status === 404) {
            Object.values(response.error.errors).map((message) => {
              alert(message);
            });
          }
          if (response.status >= 500) {
            alert("something happened on the server")
          }
        }
      })
  }
}
