<script lang="ts">
  import { lrc, media, rawLrc } from '$lib/stores'
  import Warning from '~icons/material-symbols/warning-rounded'
  import Back from '~icons/material-symbols/arrow-back-ios-new-rounded'
</script>

{#if $media && $rawLrc}
  <div class="flex h-screen items-center justify-between gap-24 px-24">
    <!-- svelte-ignore a11y_media_has_caption -->
    <!-- TODO: Add video captions using the LRC file -->
    <video src={URL.createObjectURL($media)} class="h-fit max-w-[40%] rounded-xl" autoplay></video>
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
