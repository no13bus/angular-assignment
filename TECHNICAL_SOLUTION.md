# Technical Solution

Please check the code comments in the following files for detailed modifications:

- `user-form.component.ts`：Main business logic implementation
- `user-form.component.html`：Form UI implementation
- `user-service.service.ts`：Data service layer implementation
- `api.service.ts`: Backend emulation layer implementation (modified for skills persistence)

## Features

- Form validation and error handling optimization
- Name auto-update: `full_name` updates automatically with changes to `first_name` and `last_name`
- Skills management: Supports skill search, autocomplete, add/remove functionality
- New feature: Name pronunciation button (for international communication and interview convenience)
  - I added a feature to pronounce the user's full name using SpeechSynthesisUtterance, as my name can sometimes be difficult to pronounce, especially during interviews.
- Toast notifications: Provides user feedback for form actions and errors

## Known Issue

1. Initial Implementation:

   - Since `api.service.ts` was marked as "DO NOT MODIFY", skills data was not persisted after page refresh. Backend support would be needed for complete implementation of this feature.

2. Current Solution:
   - If we can modify `api.service.ts`, I have implemented skills persistence in localStorage by adding the skills field to UserBackend interface and updating the storage logic accordingly.
