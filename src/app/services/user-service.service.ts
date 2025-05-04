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
            // Fix 6: By modifying full_name in the service, it simplifies component logic, ensures consistency across the application
            full_name: `${user.first_name} ${user.last_name}`
          }
        })
      )
  }

  updateUser(user: User): Observable<UserBackend> {
    return this.apiService.updateUser(user)
  }
}