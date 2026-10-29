import { Directive, inject } from '@angular/core';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState {
  // protected authService = inject(FirebaseAuthService);
  // protected user = this.authService.user;

  // protected login(email: string, password: string) {
  //   this.authService.login(email, password);
  // }
}
