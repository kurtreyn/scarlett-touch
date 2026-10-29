export interface IFormType {
    formType: 'generic' | 'login' | 'signup' | 'contact';
}

export interface IFormData {
    inputField?: string;
    imageInput?: File;
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