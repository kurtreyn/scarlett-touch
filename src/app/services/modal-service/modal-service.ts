import { Service, signal } from '@angular/core';
import { APP_KEY_VALUES } from '../../../config/appKeyValues';

@Service()
export class ModalService {
    public isOpen = signal<boolean>(false);
    public modalType = signal<string>(APP_KEY_VALUES.confirmation_modal_type);
    public title = signal<string>('Confirm Action');
    public message = signal<string>('Are you sure you want to proceed?');

    private _onConfirmCallback?: () => void;

    public openModal(type: string, title: string, message: string, onConfirm: () => void) {
        this.modalType.set(type);
        this.title.set(title);
        this.message.set(message);
        this._onConfirmCallback = onConfirm;
        this.isOpen.set(true);
    }

    public closeModal() {
        this.isOpen.set(false);
        this._onConfirmCallback = undefined;
    }

    public confirm() {
        if (this._onConfirmCallback) {
            this._onConfirmCallback();
        }
        this.closeModal();
    }
}
