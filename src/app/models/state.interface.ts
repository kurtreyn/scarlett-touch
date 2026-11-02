export interface IFormType {
    formType: 'post' | 'login' | 'signup' | 'contact';
}

export interface IFormData {
    postTopic?: string;
    inputField?: string; // Used for post content/body
    imageInput?: File[];
    email?: string;
    password?: string;
    signupUsername?: string;
    signupEmail?: string;
    signupPassword?: string;
    contactName?: string;
    contactEmail?: string;
    contactMessage?: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IPost {
    category: 'general' | 'announcement' | 'image_gallery' | 'service';
    content?: string;
    images?: IImage[];
    createdAt: Date;
    page: 'home' | 'about' | 'services' | 'gallery';
    services?: IService[];
}

export interface IImage {
    file: File;
    hide: boolean;
}

export interface IService {
    name: string;
    description: string;
    image?: IImage;
}