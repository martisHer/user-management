import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Group, User } from '../interfaces';
import { UserService } from '../user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { NewUserDialogComponent } from '../new-user-dialog/new-user-dialog.component';
import { NewGroupDialogComponent } from '../new-group-dialog/new-group-dialog.component';

export interface DialogData {
  user: User;
  groups: Group [];
}

export interface DialogData {
  id: number;
  item: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  
  private ngUnsubscribe = new Subject<void>();

  displayedColumns: string[] = ['id', 'name', 'lastname', 'email', 'group', 'creationDate', 'edit', 'delete'];
  dataSource = new MatTableDataSource<User>();
  users: User [] = []; // list of users
  groups: Group [] = []; // list of groups for visualization and creating new user
  loadUsers = false; // check when users are loaded
  loadGroups = false; // check when groups are loaded

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private userService: UserService,
    public dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.getUsers();
    this.getGroups();
  }

  /**
   * Get list of users and initialize table
   */
  getUsers(): void {
    this.userService.getUsers()
    .subscribe(user => {
      this.dataSource = new MatTableDataSource<User>(user);
      this.dataSource.paginator = this.paginator;
      this.users = user;
      this.loadUsers = true;
    });
  }

   /**
   * Get list of groups
   */
   getGroups(): void {
    this.userService.getGroups().subscribe(group => {
      this.groups = group;
      this.loadGroups = true;
    });
  }


  /**
   * Filter user list by name, lastname or email
   * @param event query
   */
  searchUser(event: Event) {
    var query = (event.target as HTMLInputElement).value;
    this.dataSource.filter = query.trim().toLocaleLowerCase();
    this.dataSource.paginator = this.paginator;
  }


  /**
   * Open deleting confirmation dialog
   * @param id user id to delete
   */
  openDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {id,
            item: 'user' },

    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.deleteUser(result);
    });
  }

  /**
   * Delete user
   * @param id user id
   */
  deleteUser(id: number) {
    this.userService.deleteUser(id)
    .subscribe(user => {
      this.getUsers(); // Refresh table
      console.log("User deleted. Id: " + user.id);
    });
  }

  /**
   * Open add/edit user dialog
   * @param user empty when adding new user
   */
  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(NewUserDialogComponent, {
      data: {user,
            groups: this.groups},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The user dialog was closed: ' + result);
      this.getUsers(); // Refresh table
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
