import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trailer-modal.component.html'
})
export class TrailerModalComponent {
  @Input() isOpen = false;
  @Input() trailerUrl?: string;
  @Input() movieTitle = 'Movie Trailer';
  @Output() close = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }
}
