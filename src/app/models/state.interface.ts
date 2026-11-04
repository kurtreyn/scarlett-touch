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

export interface IImage {
    url?: string;
    file?: File;
    hide: boolean;
}

export interface IPost {
    id?: string;
    category: 'general' | 'announcement' | 'image_gallery' | 'service';
    content?: string;
    images?: IImage[];
    createdAt: Date | string;
    page: 'about' | 'services' | 'gallery';
    services?: IService[];
}

export interface IService {
    name: string;
    description: string;
    image?: IImage;
}


/*
image_gallery post payload:

category: "image_gallery"
content: ""
createdAt: "2026-11-04T18:18:33.382Z"
images: Array(1)0: 
{url: 'https://firebasestorage.googleapis.com/v0/b/python…=media&token=47cc77c7-d42d-416d-a090-3f2d576b06f3', hide: false}
length: 1
[[Prototype]]: Array(0)
page: "gallery"



announcement post payload:

category: "announcement"
content: "My announcement"
createdAt: "2026-11-04T18:21:06.858Z"
images: []
page: "about"

service post payload:

category: "service"
content: ""
createdAt: "2026-11-04T18:22:29.891Z"
images: [
    {
        hide: false,
        url: "https://firebasestorage.googleapis.com/v0/b/pythonserver-eb027.appspot.com/o/scarlett_touch_images%2Fservice%2F2026-11-04%2F1793816549302_blame_ai2.jpg?alt=media&token=f71b6576-dcc3-4fee-8883-4c8af88ebb58"
    }
]
page: "services"
services: [
    {
        description: "clean hair with shampoo",
        name: "clean hair"
    }
]


*/