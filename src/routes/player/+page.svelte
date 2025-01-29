<script lang="ts">
  import { lrc, media, mediaUrl, rawLrc } from '$lib/stores'
  import { scale } from 'svelte/transition'
  import Warning from '~icons/material-symbols/warning-rounded'
  import Back from '~icons/material-symbols/arrow-back-ios-new-rounded'
  import Play from '~icons/material-symbols/play-arrow-rounded'
  import Pause from '~icons/material-symbols/pause-rounded'

  let video: HTMLVideoElement | null = $state(null)
  let isPlaying = $state(true)
  let currentTime = $state(0)
  let duration = $state(0)
  let volume = $state(1)
  let prevVolume = $state(1)

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  function togglePlay() {
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    isPlaying = !isPlaying
  }

  function toggleMute() {
    if (!video) return
    if (volume === 0) {
      volume = prevVolume
    } else {
      prevVolume = volume
      volume = 0
    }
    video.volume = volume
  }

  function handleTimeUpdate() {
    if (!video) return
    currentTime = video.currentTime
  }

  function handleLoadedMetadata() {
    if (!video) return
    duration = video.duration
  }

  function handleVolumeChange() {
    if (!video) return
    volume = video.volume
  }

  function handleProgressChange(e: Event) {
    if (!video) return
    const target = e.target as HTMLInputElement
    video.currentTime = Number(target.value)
  }

  function handleVolumeSliderChange(e: Event) {
    if (!video) return
    const target = e.target as HTMLInputElement
    volume = Number(target.value)
    video.volume = volume
  }

  $effect(() => {
    if (video) {
      video.volume = volume
    }
  })
</script>

{#if $media && $rawLrc}
  <div class="flex h-screen items-center justify-between gap-24 px-24">
    <div class="flex max-w-[40%] flex-col items-center justify-center gap-4">
      <!-- svelte-ignore a11y_media_has_caption -->
      <!-- TODO: Add video captions using the LRC file -->
      <!-- Video -->
      <video
        bind:this={video}
        src={$mediaUrl}
        class="h-fit rounded-xl"
        autoplay
        onplay={() => (isPlaying = true)}
        onpause={() => (isPlaying = false)}
        ontimeupdate={handleTimeUpdate}
        onloadedmetadata={handleLoadedMetadata}
        onvolumechange={handleVolumeChange}
      ></video>

      <!-- Metadata -->
      {#if $lrc?.ti || $lrc?.ar || $lrc?.al}
        <div class="flex flex-col items-center gap-1 text-center">
          <span class="text-2xl font-medium">{$lrc?.ti || 'Untitled'}</span>
          <span class="text-sm font-medium text-neutral-400">
            {#if $lrc?.ar && $lrc?.al}
              {$lrc.ar} - {$lrc.al}
            {:else if $lrc?.ar}
              {$lrc.ar}
            {:else if $lrc?.al}
              {$lrc.al}
            {/if}
          </span>
        </div>
      {/if}

      <!-- Controls -->
      <div class="flex w-full flex-col items-center gap-2">
        <!-- Progress bar -->
        <div class="flex w-full items-center gap-2 text-sm text-neutral-400">
          <span class="w-8">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            class="grow"
            oninput={handleProgressChange}
          />
          <span class="w-8 text-right">{formatTime(duration)}</span>
        </div>

        <!-- Play and volume controls -->
        <button
          class="relative size-16 rounded-full duration-150 hover:scale-105 hover:bg-neutral-900 active:scale-95 active:opacity-80"
          onclick={togglePlay}
        >
          {#if isPlaying}
            <div
              class="absolute inset-0 flex items-center justify-center"
              transition:scale={{ duration: 300 }}
            >
              <Pause class="size-12" />
            </div>
          {:else}
            <div
              class="absolute inset-0 flex items-center justify-center"
              transition:scale={{ duration: 300 }}
            >
              <Play class="size-12" />
            </div>
          {/if}
        </button>
      </div>
    </div>

    <div class="h-screen overflow-y-auto">
      <div class="my-[50%] flex flex-col gap-2">
        {#each $lrc?.scripts!.map((script) => script.text) ?? [] as lyric}
          <span class="text-3xl">{lyric}</span>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <div class="flex h-screen items-center justify-center text-neutral-600">
    <div class="relative flex flex-col items-center gap-2">
      <div class="absolute inset-0 -z-10 rounded-2xl bg-white/10 blur-3xl"></div>
      <Warning class="size-24" />
      <span class="text-center text-lg font-medium">No media or LRC file selected</span>
      <a
        href="/"
        class="flex items-center gap-1 rounded-full bg-neutral-800 py-2 pl-3 pr-4 text-neutral-400 duration-150 hover:bg-neutral-700 active:scale-95"
      >
        <Back class="size-4" />
        Go back
      </a>
    </div>
  </div>
{/if}
