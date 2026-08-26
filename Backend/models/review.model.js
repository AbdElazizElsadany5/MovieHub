<div class="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-6 text-center">
 
  <div class="max-w-xl space-y-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
    <div class="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-red-600/30">
      {{ authService.currentUser()?.name?.charAt(0)?.toUpperCase() || '👤' }}
    </div>

    <h1 class="text-3xl font-extrabold text-white">
      Welcome, {{ authService.currentUser()?.name }}!
    </h1>

    <div class="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4 text-left text-xs space-y-2 font-mono">
      <div class="text-neutral-400 uppercase font-sans font-semibold text-[10px]">User Details from API (/api/auth/me):</div>
      <div><span class="text-neutral-500">ID:</span> <span class="text-red-400">{{ authService.currentUser()?._id }}</span></div>
      <div><span class="text-neutral-500">Name:</span> <span class="text-neutral-200">{{ authService.currentUser()?.name }}</span></div>
      <div><span class="text-neutral-500">Email:</span> <span class="text-neutral-200">{{ authService.currentUser()?.email }}</span></div>
      <div><span class="text-neutral-500">Role:</span> <span class="text-amber-400">{{ authService.currentUser()?.role }}</span></div>
    </div>

    <button
      (click)="onLogout()"
      class="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-all cursor-pointer"
    >
      Sign Out
    </button>
  </div>
</div>
