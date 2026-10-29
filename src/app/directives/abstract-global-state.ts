import { Directive, inject, OnInit, OnDestroy, OnChanges } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase/firebase-service';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy, OnChanges {
  protected auth = inject(Auth);
  protected firebaseService = inject(FirebaseService);
  protected currentUser$ = user(this.auth);


  protected login(email: string, pass: string) {
    return this.firebaseService.login(email, pass);
  }

  protected logout() {
    return this.firebaseService.logout();
  }

  ngOnChanges(): void {
    // Handle changes here
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnDestroy(): void {
    // Cleanup logic here
  }
}
