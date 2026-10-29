import { Directive, inject, OnInit, OnDestroy } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { FirebaseService } from '../services/firebase/firebase-service';

@Directive({
  selector: '[appAbstractGlobalState]',
})
export class AbstractGlobalState implements OnInit, OnDestroy {
  protected auth = inject(Auth);
  protected firebaseService = inject(FirebaseService);
  protected currentUser$ = user(this.auth);


  protected login(email: string, pass: string) {
    return this.firebaseService.login(email, pass);
  }

  protected logout() {
    return this.firebaseService.logout();
  }

  ngOnInit(): void {
    // Initialization logic here
  }

  ngOnDestroy(): void {
    // Cleanup logic here
  }
}
