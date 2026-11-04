import { Service, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut, Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { IImage, IPost, IService } from '../../models/state.interface';

@Service()
export class FirebaseService {
    private _firestore = inject(Firestore);
    private _auth = inject(Auth);
    private _storage = inject(Storage);

    public getPosts(collectionName: string): Observable<IPost[]> {
        const colRef = collection(this._firestore, collectionName);

        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const posts = snapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() } as IPost));
                subscriber.next(posts);
            }, (error) => {
                console.error('Error fetching posts snapshot:', error);
                subscriber.error(error);
            });

            return () => unsubscribe();
        });
    }

    public async addDocument(collectionName: string, data: Partial<IPost>): Promise<string> {
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

    public async updateDocument(collectionName: string, docId: string, data: Partial<IPost>): Promise<void> {
        try {
            const docRef = doc(this._firestore, `${collectionName}/${docId}`);
            await updateDoc(docRef, data);
            console.log('Document updated with ID: ', docId);
        } catch (error) {
            console.error('Error updating document: ', error);
            throw error;
        }
    }

    public async deleteDocument(collectionName: string, docId: string): Promise<void> {
        try {
            const docRef = doc(this._firestore, `${collectionName}/${docId}`);
            await deleteDoc(docRef);
            console.log('Document deleted with ID: ', docId);
        } catch (error) {
            console.error('Error deleting document: ', error);
            throw error;
        }
    }

    public async submitPost(postData: {
        category?: IPost['category'];
        content?: string;
        page?: IPost['page'];
        services?: IService[];
        files?: File[];
    }): Promise<string> {
        try {
            const selectedCategory: IPost['category'] = postData.category || (APP_KEY_VALUES.general_category as IPost['category']);
            const selectedPage: IPost['page'] = postData.page || (APP_KEY_VALUES.about_page as IPost['page']);
            const imageUrls = await this._uploadImages(selectedCategory, postData.files);

            let contentValue = '';
            let pageValue: IPost['page'] = selectedPage;
            let servicesValue: IService[] | undefined = undefined;

            if (selectedCategory === APP_KEY_VALUES.image_gallery_category) {
                contentValue = '';
                pageValue = APP_KEY_VALUES.gallery_page as IPost['page'];
            } else if (selectedCategory === APP_KEY_VALUES.service_category) {
                contentValue = '';
                pageValue = APP_KEY_VALUES.services_page as IPost['page'];
                servicesValue = postData.services || [];
            } else {
                contentValue = postData.content || '';
                pageValue = selectedPage;
            }

            const postPayload: IPost = {
                category: selectedCategory,
                content: contentValue,
                page: pageValue,
                createdAt: new Date().toISOString(),
                images: imageUrls,
                ...(servicesValue && { services: servicesValue })
            };

            const docId = await this.addDocument(APP_KEY_VALUES.posts_collection, postPayload);
            return docId;
        } catch (error) {
            console.error('Error submitting post:', error);
            throw error;
        }
    }

    public async deleteImageFile(fileUrl: string): Promise<void> {
        try {
            const fileRef = ref(this._storage, fileUrl);
            await deleteObject(fileRef);
            console.log('Image successfully deleted from Storage:', fileUrl);
        } catch (error) {
            console.error('Error deleting image from Storage:', error);
        }
    }

    private async _uploadImages(category: string, files?: File[]): Promise<IImage[]> {
        if (!files || files.length === 0) {
            return [];
        }

        const subFolderName = category.toLowerCase().replace(/\s+/g, '_');
        const dateString = new Date().toISOString().split('T')[0];

        const uploadPromises = files.map(async (file) => {
            const filePath = `${APP_KEY_VALUES.images_folder}/${subFolderName}/${dateString}/${Date.now()}_${file.name}`;
            const fileRef = ref(this._storage, filePath);

            const snapshot = await uploadBytes(fileRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return {
                url: url,
                hide: false
            } as IImage;
        });

        return await Promise.all(uploadPromises);
    }

    public async login(email: string, pass: string) {
        const response = await signInWithEmailAndPassword(this._auth, email, pass);
        return response;
    }

    public async logout() {
        return await signOut(this._auth);
    }
}