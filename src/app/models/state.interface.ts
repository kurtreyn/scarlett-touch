export interface IFormType {
    formType: 'post' | 'login' | 'signup' | 'contact';
}

export interface IFormData {
    category?: 'general' | 'announcement' | 'image_gallery' | 'service';
    content?: string;
    page?: 'about' | 'services' | 'gallery';
    serviceName?: string;
    serviceDescription?: string;
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
    id?: string;
    category: 'general' | 'announcement' | 'image_gallery' | 'service';
    content?: string;
    images?: IImage[];
    createdAt: Date;
    page: 'about' | 'services' | 'gallery';
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