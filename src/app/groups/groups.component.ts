import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Group, User } from '../interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../user.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NewGroupDialogComponent } from '../new-group-dialog/new-group-dialog.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, OnDestroy {
  
  private ngUnsubscribe = new Subject<void>();

  displayedColumns: string[] = ['id', 'name', 'creationDate', 'details', 'delete'];
  dataSource = new MatTableDataSource<Group>();
  groups: Group [] = [];
  users: User [] = [];
  deleteError = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.deleteError = false;
    this.getGroups();
  }

  /**
   * Get list of groups and initialize table
   */
  getGroups(): void {
    this.userService.getGroups()
    .subscribe(groupList => {
      this.dataSource = new MatTableDataSource<Group>(groupList);
      this.dataSource.paginator = this.paginator;
      this.groups = groupList;
    });
  }

  /**
   * Filter group list by name
   * @param event query
   */
  searchGroup(event: Event) {
    var query = (event.target as HTMLInputElement).value;
    this.dataSource.filter = query.trim().toLocaleLowerCase();
    this.dataSource.paginator = this.paginator;
  }

  
  /**
   * Open deleting confirmation dialog
   * @param id user id to delete
   */
  openDialog(id: number): void {
    this.getUsersByGroup(id);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {id,
            item: 'group'},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.deleteGroup(result);
    });
  }

  /**
   * Delete group: Delete is only possible if no users are associated to a group
   * @param id group id
   */
  deleteGroup(id: number) {
    if (this.users.length > 0) {
      this.deleteError = true;
    } else {
      this.userService.deleteGroup(id)
      .subscribe(group => {
        this.getGroups(); // Refresh table
        console.log("Group deleted. Id: " + group.id);
      });
    }
  }

  /**
   * Get list of users that belong to a given group.
   * @param id gorup id
   */
  getUsersByGroup(id: number) {
    this.userService.getUserByGroupId(id)
    .subscribe(userList => {
      this.users = userList; // Refresh table
    });
  }

  
  /**
   * Open add/edit group dialog
   */
  openGroupDialog(): void {
    const dialogRef = this.dialog.open(NewGroupDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getGroups();
      console.log('The group dialog was closed: ' + result);
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
