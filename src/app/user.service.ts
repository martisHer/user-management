import { Injectable } from '@angular/core';
import { API } from './constants';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { User, Group } from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {}

  /**
   * Get list of users from json-server
   * @returns list of users
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API}/users`);
  }

  /**
   * Get list of groups from json-server
   * @returns list of groups
   */
  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(`${API}/groups`);
  }

  /**
   * Get user by id
   * @param id user id
   * @returns unique user
   */
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${API}/users?id=${id}`);
  }

  /**
   * Get group by id
   * @param id group id
   * @returns unique group
   */
  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group[]>(`${API}/groups?id=${id}`).pipe(
      map(groups => {
        if (groups.length > 0) {
          return groups[0];
        } else {
          throw new Error("Group not found");
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Catch errors in Http methods and throw an error message
   * @param error 
   * @returns 
   */
  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  /**
   * Get list of users belonging to a given group id
   * @param id group id
   * @returns patients of a given group
   */
  getUserByGroupId(id: number): Observable<User []> {
    return this.http.get<User []>(`${API}/users?group=${id}`);
  }

  /**
   * Delete user given user's id
   * @param id user's id
   * @returns 
   */
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(`${API}/users/${id}`, this.httpOptions);
  }

  /**
   * Delete group given group's id
   * @param id group's id
   * @returns 
   */
  deleteGroup(id: number): Observable<Group> {
    return this.http.delete<Group>(`${API}/groups/${id}`, this.httpOptions);
  }

  /**
   * Create new user and add it to json-server
   * @param user user to add
   * @returns updated list of users
   */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${API}/users`, user, this.httpOptions); 
  }


  /**
   * Edit user
   * @param id user's id
   * @param user user to add
   * @returns updated list of users
   */
  editUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${API}/users/${id}`, user, this.httpOptions); 
  }

  /**
   * Create new group and add it to json-server
   * @param group group to add
   * @returns updated list of groups
   */
  addGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(`${API}/groups`, group, this.httpOptions); 
  }

}
