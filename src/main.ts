import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UserFormComponent } from "./app/components/user-form/user-form.component";
import { TaskDescriptionComponent } from "./app/components/task-description/task-description.component";
import { ToastComponent } from "./app/components/toast/toast.component";

// By including the ToastComponent in the App component, it allows the toast notifications to be used globally throughout the application.
@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-toast></app-toast>
    <app-user-form></app-user-form>
    <app-task-description></app-task-description>
  `,
  imports: [UserFormComponent, TaskDescriptionComponent, ToastComponent],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
