import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { Group } from '../interfaces';

@Component({
  selector: 'app-new-group-dialog',
  templateUrl: './new-group-dialog.component.html',
  styleUrls: ['./new-group-dialog.component.css']
})
export class NewGroupDialogComponent implements OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  submitted = false;
  formdata!: FormGroup;

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<NewGroupDialogComponent>,
    private userService: UserService,) {
      this.formdata = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(4)]]
      });
  }

      /**
  * Create new user or edit existing one
  * @param data 
  */
  submitForm() {
    if( this.formdata.valid){
      const newGroup: Group = this.formdata.value; //updated video object
      newGroup.creationDate = new Date;
      this.userService.addGroup(newGroup).subscribe(group => {
        console.log("New group added: " + group.name);
       });
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
