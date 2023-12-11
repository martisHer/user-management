import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {HttpClientModule} from '@angular/common/http';
import { GroupsComponent } from './groups.component';
import { UserService } from '../user.service';
import { of } from 'rxjs';
import { Group } from '../interfaces';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatIconModule } from '@angular/material/icon'; 
import { MatPaginatorModule } from '@angular/material/paginator';




describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['deleteGroup']);
    
    TestBed.configureTestingModule({
      declarations: [GroupsComponent],
      imports: [HttpClientTestingModule, MatDialogModule, OverlayModule, MatIconModule, MatPaginatorModule ],
      providers: [{ provide: UserService, useValue: userServiceSpy }]
    });
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
 
  });

  it('Test: delete the group if no users belong to the group', fakeAsync(() => {
    const groupId = 1;
    component.users = [];
    spyOn(component, 'getGroups'); // Spy on and call through to the original getGroups method


    // Mock the deleteGroup method of UserService to return an observable with a dummy group
    userService.deleteGroup.and.returnValue(of({ id: groupId } as Group));

    component.deleteGroup(groupId);
    tick(); // Simulate the passage of time for async operations

    // Assert
    expect(userService.deleteGroup).toHaveBeenCalledWith(groupId);
    expect(component.deleteError).toBeFalsy();
    expect(component.getGroups).toHaveBeenCalled();
  }));


  it('Test: set deleteError to true if users belong to the group', fakeAsync(() => {
    const groupId = 1;
    component.users = [{ id: 1, name: 'John', lastname: 'Doe', email: 'john.doe@example.com', group: [], creationDate: new Date() }];
    spyOn(component, 'getGroups');

    component.deleteGroup(groupId);
    tick();

    expect(component.deleteError).toBeTruthy();
    expect(userService.deleteGroup).not.toHaveBeenCalled();
    expect(component.getGroups).not.toHaveBeenCalled();
  }));


});
