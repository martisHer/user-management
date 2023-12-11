import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Group, User } from '../interfaces';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '../users/users.component';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrls: ['./new-user-dialog.component.css']
})
export class NewUserDialogComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  submitted = false;
  formdata!: FormGroup;
  groups: Group [] = [];

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private userService: UserService,) {
      this.formdata = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        group: [Validators.required]
      });
    }

  ngOnInit() { 
    if (this.data.user) { // Edit user
      this.initializeForm(this.data.user);
    } 
  }

  /**
   * Initialize form with user data
   * @param patientData 
   */
  initializeForm(patientData: User) {
    this.formdata = this.fb.group({
      name: [patientData.name],
      lastname: [patientData.lastname],
      email: [patientData.email],
      group: [patientData.group]
    });
  }

  /**
  * Create new user or edit existing one
  * @param data 
  */
  submitForm() {
    if( this.formdata.valid){
      const newUser: User = this.formdata.value; //updated video object
      if (this.data.user) {
        newUser.id = this.data.user.id;
        newUser.creationDate = this.data.user.creationDate;
        this.userService.editUser(this.data.user.id, newUser)
        .subscribe(user => {
          this.data.user = user;
        });
      } else {
        newUser.creationDate = new Date();
        this.userService.addUser(newUser)
        .subscribe(user => {
          this.data.user = user;
        });
      }
      this.dialogRef.close();
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

   /**
   * Cancel subscriptions to prevent memory leaks
   */
   ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  
}
