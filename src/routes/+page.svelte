<script lang="ts">
  import Movie from '~icons/material-symbols/movie-rounded'
  import Lyrics from '~icons/material-symbols/lyrics-rounded'

  let mediaFile = $state<File | null>(null)
  let lrcFile = $state<File | null>(null)

  function handleMediaFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      mediaFile = input.files[0]
    }
  }

  function handleLrcFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      lrcFile = input.files[0]
    }
  }
</script>

<div class="flex h-screen items-center justify-center gap-2 text-neutral-600">
  <input
    type="file"
    accept="video/*"
    class="hidden"
    id="media-input"
    onchange={handleMediaFileSelect}
  />
  <label
    for="media-input"
    class="relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-5 duration-500 hover:text-neutral-500"
  >
    <div class="absolute inset-0 rounded-2xl bg-white/10 blur-3xl"></div>
    <Movie class="size-24" />
    <span class="text-center text-lg font-medium">
      {mediaFile ? mediaFile.name : 'Select a video'}
    </span>
  </label>

  <input type="file" accept=".lrc" class="hidden" id="lrc-input" onchange={handleLrcFileSelect} />
  <label
    for="lrc-input"
    class="relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-5 duration-500 hover:text-neutral-500"
  >
    <div class="absolute inset-0 rounded-2xl bg-white/10 blur-3xl"></div>
    <Lyrics class="size-24" />
    <span class="text-center text-lg font-medium">
      {lrcFile ? lrcFile.name : 'Select a .lrc file'}
    </span>
  </label>
</div>
