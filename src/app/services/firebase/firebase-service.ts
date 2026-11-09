import { Service, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut, Auth } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';
import { IImage, IPageContent, IPost, IService } from '../../models/state.interface';

@Service()
export class FirebaseService {
    private _firestore = inject(Firestore);
    private _auth = inject(Auth);
    private _storage = inject(Storage);

    public getPosts(collectionName: string): Observable<IPost[]> {
        const colRef = collection(this._firestore, collectionName);

        return new Observable(subscriber => {
            const unsubscribe = onSnapshot(colRef, (snapshot) => {
                const posts = snapshot.docs.map(docSnapshot => {
                    const data = docSnapshot.data() as Partial<IPost>;
                    return {
                        id: docSnapshot.id,
                        ...data,
                        images: this._normalizeImages(data.images)
                    } as IPost;
                });
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
            const payload: Partial<IPost> = { ...data };
            if (payload.images) {
                payload.images = this._normalizeImages(payload.images);
            }
            const docRef = doc(this._firestore, `${collectionName}/${docId}`);
            await updateDoc(docRef, payload);
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
        pageContent?: IPageContent;
    }): Promise<string> {
        try {
            const selectedCategory: IPost['category'] = postData.category || (APP_KEY_VALUES.general_category as IPost['category']);
            const selectedPage: IPost['page'] = postData.page || (APP_KEY_VALUES.about_page as IPost['page']);
            const uploadedImages = await this._uploadImages(selectedCategory, postData.files);
            const normalizedImages = this._normalizeImages(uploadedImages);

            let contentValue = '';
            let pageValue: IPost['page'] = selectedPage;
            let servicesValue: IService[] | undefined = undefined;
            let pageContentValue: IPageContent | undefined = postData.pageContent;

            if (selectedCategory === APP_KEY_VALUES.image_gallery_category) {
                contentValue = '';
                pageValue = APP_KEY_VALUES.gallery_page as IPost['page'];
            } else if (selectedCategory === APP_KEY_VALUES.service_category) {
                contentValue = '';
                pageValue = APP_KEY_VALUES.services_page as IPost['page'];
                servicesValue = postData.services || [];
            } else if (selectedCategory === 'page_text') {
                contentValue = '';
                pageValue = postData.page || 'home';
            } else {
                contentValue = postData.content || '';
                pageValue = selectedPage;
            }

            const postPayload: IPost = {
                category: selectedCategory,
                content: contentValue,
                page: pageValue,
                createdAt: new Date().toISOString(),
                images: normalizedImages,
                ...(servicesValue && { services: servicesValue }),
                ...(pageContentValue && { pageContent: pageContentValue })
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

    public async uploadImagesDirectly(category: string, files?: File[]): Promise<IImage[]> {
        return await this._uploadImages(category, files);
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

    private _normalizeImages(images: unknown[] | undefined): IImage[] {
        if (!images || !Array.isArray(images)) {
            return [];
        }
        return images.map(img => {
            if (typeof img === 'string') {
                return { url: img, hide: false };
            }
            if (img && typeof img === 'object') {
                const imageObj = img as Partial<IImage>;
                return {
                    url: imageObj.url || '',
                    hide: typeof imageObj.hide === 'boolean' ? imageObj.hide : false,
                    ...(imageObj.file && { file: imageObj.file })
                };
            }
            return { url: '', hide: false };
        });
    }

    public async login(email: string, pass: string) {
        const response = await signInWithEmailAndPassword(this._auth, email, pass);
        return response;
    }

    public async logout() {
        return await signOut(this._auth);
    }
}