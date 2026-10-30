import { Service, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { FirebaseService } from '../firebase/firebase-service';

@Service()
export class GlobalStateService {
    private _auth = inject(Auth);
    private _firebaseService = inject(FirebaseService);

    public currentUser$ = user(this._auth);

    public login(email: string, pass: string) {
        return this._firebaseService.login(email, pass);
    }

    public logout() {
        return this._firebaseService.logout();
    }

}
