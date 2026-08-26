import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-trailer-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trailer-modal.component.html'
})
export class TrailerModalComponent implements OnChanges {
  private sanitizer = inject(DomSanitizer);

  @Input() isOpen = false;
  @Input() trailerUrl?: string;
  @Input() movieTitle = 'Movie Trailer';
  
  @Output() close = new EventEmitter<void>();

  safeUrl: SafeResourceUrl | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['trailerUrl'] && this.trailerUrl) {
      const embedUrl = this.getEmbedUrl(this.trailerUrl);
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  private getEmbedUrl(url: string): string {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/') + '?autoplay=1';
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  }
}
