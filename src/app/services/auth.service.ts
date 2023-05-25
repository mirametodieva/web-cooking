import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { apiUrls } from '../utils/api-urls';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLogged = new BehaviorSubject<boolean>(
    !!localStorage.getItem('currentUser')
  );
  isLogged$ = this.isLogged.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}

  getCurrentUser(): Observable<User> {
    const currentUserId = localStorage.getItem('currentUser');
    if (currentUserId) {
      return this.http.get<User>(apiUrls.AUTH + '/' + currentUserId);
    }
    return of({} as User);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(apiUrls.AUTH);
  }

  logIn(user: User): Observable<User> {
    const { email, password } = user;
    return this.http
      .post<User>(apiUrls.AUTH + '/login', { email, password })
      .pipe(
        tap((user) => {
          if (user && user['_id']) {
            const { favoriteRecipes, isAdmin } = user;
            localStorage.setItem('currentUser', user['_id'] || '');
            localStorage.setItem(
              'favoriteRecipes',
              JSON.stringify(favoriteRecipes)
            );
            localStorage.setItem('isAdmin', isAdmin || 'false');
            this.isLogged.next(true);
          }
        })
      );
  }

  signUp(newUser: User): Observable<User> {
    const { email, password, repeatedPassword } = newUser;
    return this.http
      .post<User>(apiUrls.AUTH + '/signup', {
        email,
        password,
        repeatedPassword,
        isAdmin: false,
        favoriteRecipes: [],
        cookedRecipe: [],
        avatar: '',
      });
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('favoriteRecipes');
    localStorage.removeItem('isAdmin');

    this.router.navigate(['/login']);
    this.isLogged.next(false);
  }
}
