import { Service, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut, Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Service()
export class FirebaseService {
    private _firestore = inject(Firestore);
    private _auth = inject(Auth);

    // ==========================================
    // FIRESTORE DATABASE METHODS
    // ==========================================

    /**
     * Fetch a live stream of data from a Firestore collection
     */
    public getCollectionData(collectionName: string): Observable<any[]> {
        const colRef = collection(this._firestore, collectionName);
        return collectionData(colRef, { idField: 'id' });
    }

    /**
     * Add a new document to a Firestore collection
     */
    public async addDocument(collectionName: string, data: any) {
        try {
            const colRef = collection(this._firestore, collectionName);
            const docRef = await addDoc(colRef, data);
            console.log('Document written with ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Error adding document: ', error);
            throw error;
        }
    }

    // ==========================================
    // FIREBASE AUTHENTICATION METHODS
    // ==========================================

    /**
     * Log in an existing user with email and password
     */
    public async login(email: string, pass: string) {
        const response = await signInWithEmailAndPassword(this._auth, email, pass);
        console.log('User logged in: ', response.user);
        return response;
    }

    /**
     * Log out the current user
     */
    public async logout() {
        return await signOut(this._auth);
    }

    private _setCurrentUser(user: any) {
        console.log('Setting current user: ', user);
    }
}