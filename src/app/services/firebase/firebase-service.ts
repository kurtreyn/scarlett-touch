import { Service, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut, Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, updateDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';

@Service()
export class FirebaseService {
    private _firestore = inject(Firestore);
    private _auth = inject(Auth);
    private _storage = inject(Storage);

    // ==========================================
    // FIRESTORE DATABASE & STORAGE METHODS
    // ==========================================

    /**
     * Fetch a live stream of data from a Firestore collection
     */
    public getPosts(collectionName: string): Observable<any[]> {
        const colRef = collection(this._firestore, collectionName);

        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                subscriber.next(posts);
            }, (error) => {
                console.error('Error fetching posts snapshot:', error);
                subscriber.error(error);
            });

            // Cleanup subscription on destroy
            return () => unsubscribe();
        });
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

    /**
     * Update an existing document in a Firestore collection
     */
    public async updateDocument(collectionName: string, docId: string, data: any) {
        try {
            const docRef = doc(this._firestore, `${collectionName}/${docId}`);
            await updateDoc(docRef, data);
            console.log('Document updated with ID: ', docId);
        } catch (error) {
            console.error('Error updating document: ', error);
            throw error;
        }
    }

    /**
     * Handle multi-image uploads to Storage and save the post document to Firestore
     */
    public async submitPost(topic?: string, content?: string, files?: File[]) {
        try {
            const selectedTopic = topic || 'general';
            // Pass the topic into the upload method
            const imageUrls = await this._uploadImages(selectedTopic, files);

            const postPayload = {
                topic: selectedTopic,
                content: content || '',
                images: imageUrls,
                createdAt: new Date().toISOString()
            };

            const docId = await this.addDocument(APP_KEY_VALUES.posts_collection, postPayload);
            return docId;
        } catch (error) {
            console.error('Error submitting post:', error);
            throw error;
        }
    }

    /**
     * Delete a physical image file from Firebase Storage using its download URL
     */
    public async deleteImageFile(fileUrl: string) {
        try {
            // Create a storage reference directly from the HTTPS download URL
            const fileRef = ref(this._storage, fileUrl);
            await deleteObject(fileRef);
            console.log('Image successfully deleted from Storage:', fileUrl);
        } catch (error) {
            console.error('Error deleting image from Storage:', error);
            // Non-blocking throw or swallow depending on if file already missing
        }
    }

    private async _uploadImages(topic: string, files?: File[]): Promise<string[]> {
        if (!files || files.length === 0) {
            return [];
        }

        // Clean the topic string to make it safe for storage paths (e.g., "Add to Image Gallery" -> "image_gallery")
        const subFolderName = topic.toLowerCase().replace(/\s+/g, '_');

        // Generate current date string (YYYY-MM-DD)
        const dateString = new Date().toISOString().split('T')[0];

        const uploadPromises = files.map(async (file) => {
            // Structure: folderName/YYYY-MM-DD/timestamp_filename
            const filePath = `${APP_KEY_VALUES.images_folder}/${subFolderName}/${dateString}/${Date.now()}_${file.name}`;
            const fileRef = ref(this._storage, filePath);

            const snapshot = await uploadBytes(fileRef, file);
            return await getDownloadURL(snapshot.ref);
        });

        return await Promise.all(uploadPromises);
    }

    // ==========================================
    // FIREBASE AUTHENTICATION METHODS
    // ==========================================

    /**
     * Log in an existing user with email and password
     */
    public async login(email: string, pass: string) {
        const response = await signInWithEmailAndPassword(this._auth, email, pass);
        return response;
    }

    /**
     * Log out the current user
     */
    public async logout() {
        return await signOut(this._auth);
    }
}