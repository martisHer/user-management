import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from './interfaces';
import { API } from './constants';

describe('YourService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('Test: get users by group id', () => {
    // Arrange
    const groupId = 1;

    const mockUsers: User[] = [
      { id: 1, name: 'John', lastname: 'Doe', email: 'john.doe@example.com', group: [1], creationDate: new Date() },
      { id: 2, name: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com', group: [2, 1], creationDate: new Date() },
      { id: 3, name: 'Bob', lastname: 'Mckenzy', email: 'bob.mackenzy@example.com', group: [1], creationDate: new Date() }
    ];

    service.getUserByGroupId(groupId).subscribe(users => {
        // Assert
        const usersWithCorrectGroupId = users.every(user => user.group.includes(groupId));
        expect(usersWithCorrectGroupId).toBeTruthy();
      });

    // Assert - mock the HTTP request
    const req = httpTestingController.expectOne(`${API}/users?group=${groupId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });

  it('Test: not return users with different group id', () => {
    const groupId = 1;
    const mockUsers: User[] = [
      { id: 1, name: 'John', lastname: 'Doe', email: 'john.doe@example.com', group: [2], creationDate: new Date() },
      { id: 2, name: 'Jane', lastname: 'Doe', email: 'jane.doe@example.com', group: [3], creationDate: new Date() },
      { id: 3, name: 'Bob', lastname: 'Mckenzy', email: 'bob.mackenzy@example.com', group: [2], creationDate: new Date() }
      // Add more mock users as needed
    ];

    service.getUserByGroupId(groupId).subscribe(users => {
        // Assert
        const usersWithDifferentGroupId = users.some(user => user.group.includes(groupId));
        expect(usersWithDifferentGroupId).toBeFalsy();
      });

    // Assert - mock the HTTP request
    const req = httpTestingController.expectOne(`${API}/users?group=${groupId}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockUsers);
  });
});
