import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, Observable } from 'rxjs';
import { apiUrls } from '../utils/api-urls';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  constructor(private http: HttpClient) {}

  put(updatedUser: User): Observable<User> {
    const id = updatedUser['_id'];

    return this.http
      .put<User>(apiUrls.AUTH + '/' + id, updatedUser);
  }

  isAdmin(): boolean {
    try {
      return JSON.parse(localStorage.getItem('isAdmin') || 'false');
    } catch {
      return false;
    }
  }
}
