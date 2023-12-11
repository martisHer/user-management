import { Component, OnDestroy, OnInit } from '@angular/core';
import { Group, User } from '../interfaces';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {
  group!: Group;
  users: User [] = [];
  loadUsers = false; // check if data is loaded
  loadGroup = false; 
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Get route id
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getGroupById(id);
    this.getUsersByGroup(id);
  }

   /**
   * Get group by id.
   * @param id gorup id
   */
   getGroupById(id: number) {
    this.userService.getGroupById(id).subscribe(group => {
      this.group = group; 
      this.loadGroup = true;
    });
  }

  /**
   * Get list of users that belong to a given group.
   * @param id gorup id
   */
  getUsersByGroup(id: number) {
    this.userService.getUserByGroupId(id).subscribe(userList => {
      this.users = userList; 
      this.loadUsers = true;
    });
  }

  /**
   * Cancel subscriptions to prevent memory leaks
   */
    ngOnDestroy() {
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

}
