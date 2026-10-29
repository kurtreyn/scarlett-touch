export interface IFirebaseUserMetadata {
    createdAt: string;
    lastLoginAt: string;
    lastSignInTime: string;
    creationTime: string;
}

export interface IStsTokenManager {
    refreshToken: string;
    accessToken: string;
    expirationTime: number;
}

export interface IProviderUserInfo {
    providerId: string;
    uid: string;
    displayName: string | null;
    email: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
}

export interface IFirebaseUser {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    isAnonymous: boolean;
    displayName: string | null;
    photoURL: string | null;
    phoneNumber: string | null;
    tenantId: string | null;
    providerId: string;
    accessToken: string;
    metadata: IFirebaseUserMetadata;
    stsTokenManager: IStsTokenManager;
    providerData: IProviderUserInfo[];
}

export interface IAuthCredential {
    providerId: string;
    signInMethod: string;
}

export interface ILoginResponse {
    user: IFirebaseUser;
    providerId: string | null;
    operationType: 'signIn' | 'link' | 'reauthenticate';
    credential?: IAuthCredential;
}