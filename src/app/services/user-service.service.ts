import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User, UserBackend } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  getUser(): Observable<UserBackend> {
    return this.apiService.fetchUser()
      .pipe(
        map(user => {
          return {
            ...user,
            full_name: null
          }
        })
      )
  }

  updateUser(user: User): Observable<UserBackend> {
    return this.apiService.updateUser(user)
  }
}
