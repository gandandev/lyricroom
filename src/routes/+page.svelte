<script lang="ts">
  import { scale } from 'svelte/transition'
  import Movie from '~icons/material-symbols/movie-rounded'
  import Lyrics from '~icons/material-symbols/lyrics-rounded'
  import PlayArrow from '~icons/material-symbols/play-arrow-rounded'
  import Logo from '$lib/components/Logo.svelte'

  let mediaFile = $state<File | null>(null)
  let mediaFilePreviewBlob = $state<Blob | null>(null)
  let lrcFile = $state<File | null>(null)
  let lrcFileContent = $state<string | null>(null)

  let ready = $derived(!!mediaFile && !!lrcFile)

  async function handleMediaFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      mediaFile = input.files[0]

      // Get random frame from the video
      const video = document.createElement('video')
      video.src = URL.createObjectURL(mediaFile)

      await new Promise((resolve) => {
        video.onloadedmetadata = () => {
          video.currentTime = Math.random() * video.duration
          resolve(null)
        }
      })

      await new Promise((resolve) => {
        video.onseeked = () => {
          // Create a canvas and draw video frame
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(video, 0, 0)

          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              mediaFilePreviewBlob = blob
            }
            resolve(null)
          })
        }
      })
    }
  }

  async function handleLrcFileSelect(event: Event) {
    const input = event.target as HTMLInputElement
    if (input.files?.length) {
      lrcFile = input.files[0]
      lrcFileContent = await lrcFile.text()
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
    class="group relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-5 duration-500 hover:text-neutral-500"
  >
    <div class="absolute inset-0 -z-10 rounded-2xl bg-white/10 blur-3xl"></div>
    {#if mediaFilePreviewBlob}
      <img
        src={URL.createObjectURL(mediaFilePreviewBlob)}
        alt="Media preview"
        class="h-24 max-w-32 rounded-xl shadow-lg duration-150 group-hover:scale-105"
      />
    {:else}
      <Movie class="size-24" />
    {/if}
    <span class="text-lg font-medium">
      {mediaFile ? mediaFile.name : 'Select a video'}
    </span>
  </label>

  <div class="relative size-24 shrink-0">
    {#if ready}
      <button
        class="absolute inset-0 m-2 flex items-center justify-center duration-300 hover:scale-110 active:scale-95 active:opacity-80"
        transition:scale={{ duration: 300, start: 0.5 }}
      >
        <div class="absolute inset-0 -z-10 rounded-2xl bg-white/30 blur-3xl"></div>
        <div class="absolute inset-2 -z-10 rounded-full bg-white/30 blur-2xl"></div>
        <PlayArrow class="relative size-24 text-white" />
      </button>
    {:else}
      <div class="absolute" transition:scale={{ duration: 300, start: 0.5 }}>
        <Logo class="size-24" />
      </div>
    {/if}
  </div>

  <input type="file" accept=".lrc" class="hidden" id="lrc-input" onchange={handleLrcFileSelect} />
  <label
    for="lrc-input"
    class="group relative flex h-64 w-64 cursor-pointer flex-col items-center justify-center gap-5 duration-500 hover:text-neutral-500"
  >
    <div class="absolute inset-0 -z-10 rounded-2xl bg-white/10 blur-3xl"></div>
    {#if lrcFileContent}
      <div
        class="h-24 w-20 overflow-hidden rounded-xl bg-white p-1 text-black shadow-lg duration-150 group-hover:scale-105"
      >
        <pre class="text-[0.25rem]">{lrcFileContent}</pre>
      </div>
    {:else}
      <Lyrics class="size-24" />
    {/if}
    <span class="text-lg font-medium">
      {lrcFile ? lrcFile.name : 'Select a .lrc file'}
    </span>
  </label>
</div>
