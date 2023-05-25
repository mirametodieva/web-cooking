import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged$ = new Observable<boolean>();

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isLogged$ = this.authService.isLogged$;
  }

  logout(): void{
    this.authService.logout();
  }
}
