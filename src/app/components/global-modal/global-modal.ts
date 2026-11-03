import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal-service/modal-service';

@Component({
  selector: 'app-global-modal',
  imports: [CommonModule],
  standalone: true,
  styleUrl: './global-modal.scss',
  templateUrl: './global-modal.html',
})
export class GlobalModal {
  public modalService = inject(ModalService);
}