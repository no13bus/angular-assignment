// src/app/components/user-form/user-form.component.ts

import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, ValidationErrors, FormControl } from '@angular/forms'
import { UserService } from '../../services/user-service.service'
import { CommonModule } from '@angular/common'
import { ToastService } from "../../services/toast.service"
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { User } from '../../models/user.model'

const PREDEFINED_SKILLS = [
  'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js',
  'Java', 'Python', 'C#', 'Node.js', 'Express.js',
  'HTML', 'CSS', 'SASS', 'PHP', 'Ruby',
  'SQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker',
  'Kubernetes', 'Git', 'REST API', 'GraphQL', 'UI/UX Design'
];

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup
  loading = false;
  // Fix 5: Added submitting state to prevent multiple submissions and show loading indicators.
  submitting = false;
  error: string | null = null;
  filteredSkills: string[] = [];
  isAddingSkill = false;
  skillInputControl = new FormControl('');


  constructor(private fb: FormBuilder, private userService: UserService, private toastService: ToastService) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      full_name: [{ value: '', disabled: true }],
      // Fix 1 : Added min and max constraints to age field to ensure age falls within a valid human range.
      age: [null, [Validators.required, Validators.min(1), Validators.max(110)]],
      // Fix 2: Replaced custom (incorrect) email regex with Angular's built-in Validators.email for proper email validation.
      email: ['', [Validators.required, Validators.email]],
      skills: [[], [Validators.required]],
    });
  }

  ngOnInit() {
    this.setupFullNameAutoUpdate();
    this.loadUserData();
    
    this.skillInputControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        if (value) {
          this.filterSkills(value);
        } else {
          this.filteredSkills = [];
        }
      });
  }

  // update full name by first_name and last_name changes.
  updateFullName(): void {
    const firstName = this.userForm.get('first_name')?.value || '';
    const lastName = this.userForm.get('last_name')?.value || '';
    const fullName = `${firstName} ${lastName}`.trim();
  
    this.userForm.get('full_name')?.setValue(fullName, { emitEvent: false });
  }

  // Feature: Added a function to speak the user's full name using SpeechSynthesisUtterance.
  // Idea: Because my name is a bit difficult to pronounce, I added a full name pronunciation feature to help the interviewer.
  speakFullName(): void {
    const fullName = this.userForm.get('full_name')?.value;
    if (fullName) {
      const utterance = new SpeechSynthesisUtterance(fullName);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      alert('Please enter a full name.');
    }
  }

  // automatic full name generation by subscribing to first_name and last_name changes.
  setupFullNameAutoUpdate(): void {
    this.userForm.get('first_name')?.valueChanges.subscribe(() => this.updateFullName());
    this.userForm.get('last_name')?.valueChanges.subscribe(() => this.updateFullName());
  }

  skills(): FormArray {
    return this.userForm.get('skills') as FormArray;
  }

  loadUserData() {
    this.loading = true
    this.userService.getUser()
      .subscribe({
        next: (user) => {
          this.userForm.patchValue(user)
          this.loading = false
        },
        error: () => {
          this.loading = false
          this.error = 'Failed to load user data'
          // this.toastService.show({ message: 'Failed to load user data', type: 'error' });
        }
      })
  }

  onSave() {
    if (this.userForm.valid) {
      this.submitting = true
      this.error = null
      // Fix 4: Used getRawValue() to safely extract all form values including disabled fields, then manually exclude full_name.
      const { full_name, ...userData } = this.userForm.getRawValue()
      this.userService.updateUser(userData as User)
        .subscribe({
          next: () => {
            this.submitting = false
            // Improvement: Replaced alert calls with toast notifications to improve user experience.
            this.toastService.show({ message: 'User updated successfully', type: 'success' });
          },
          error: (err) => {
            this.submitting = false
            this.error = `Failed to save user: ${err?.message || 'Unknown error'}`
            // you can also use toast to replace the error message in the form because toast have good UX and can dispear after seconds
            //this.toastService.show({ message: `Failed to save user: ${err?.message || 'Unknown error'}`, type: 'error' });
          }
        })
    }
  }

  // Error handling methods for the form fields
  getErrorMessage(controlName: string): string | null {
    const control = this.userForm.get(controlName)
    if (control && control.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      } else if (control.errors['email']) {
        return 'Enter a valid email';
      } else if (control.errors['min']) {
        // Fix 3: Enhanced form validation messages to support min and max errors.
        return `Minimum value is ${control.errors['min'].min}`;
      } else if (control.errors['max']) {
        return `Maximum value is ${control.errors['max'].max}`;
      }
    }
    return null
  }

  // Handles skill selection UI logic:
  // - startAddingSkill: enters skill input mode
  // - filterSkills: filters predefined skills based on user input
  // - selectSkill: adds selected skill to the form, avoiding duplicates
  // - resetSkillInput: exits input mode and clears suggestions
  // - removeSkill: removes a selected skill from the form
  startAddingSkill(): void {
    this.isAddingSkill = true;
  }

  filterSkills(value: string): void {
    const filterValue = value.toLowerCase();
    const currentSkills = this.userForm.get('skills')?.value as string[];
    
    this.filteredSkills = PREDEFINED_SKILLS.filter(skill => 
      skill.toLowerCase().startsWith(filterValue) &&
      !currentSkills.includes(skill)
    );
  }

  selectSkill(skill: string): void {
    const currentSkills = this.userForm.get('skills')?.value as string[];
    if (!currentSkills.includes(skill)) {
      this.userForm.patchValue({
        skills: [...currentSkills, skill]
      });
    }
    
    this.resetSkillInput();
  }

  resetSkillInput(): void {
    this.isAddingSkill = false;
    this.filteredSkills = [];
    this.skillInputControl.setValue('');
  }


  removeSkill(skillToRemove: string): void {
    const currentSkills = this.userForm.get('skills')?.value as string[];
    this.userForm.patchValue({
      skills: currentSkills.filter(skill => skill !== skillToRemove)
    });
  }
}
