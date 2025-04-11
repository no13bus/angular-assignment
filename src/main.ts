import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { UserFormComponent } from "./app/components/user-form/user-form.component";
import { TaskDescriptionComponent } from "./app/components/task-description/task-description.component";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <app-user-form></app-user-form>
    <app-task-description></app-task-description>
  `,
  imports: [UserFormComponent, TaskDescriptionComponent],
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
