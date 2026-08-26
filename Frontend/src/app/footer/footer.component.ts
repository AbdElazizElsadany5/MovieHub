@if (isOpen) {
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/85 backdrop-blur-sm" (click)="closeModal()"></div>

    <div class="relative w-full max-w-4xl bg-[#14141c] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(229,9,20,0.15)] z-10">
      <div class="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <h3 class="font-display text-xl font-bold tracking-wide uppercase text-white">
          {{ movieTitle }} — Trailer
        </h3>
        <button
          (click)="closeModal()"
          class="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      <div class="relative aspect-video bg-black">
        @if (safeUrl) {
          <iframe
            [src]="safeUrl"
            [title]="movieTitle"
            class="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        } @else {
          <div class="flex items-center justify-center h-full text-neutral-400 text-sm">
            No trailer video available for this movie.
          </div>
        }
      </div>
    </div>
  </div>
}
