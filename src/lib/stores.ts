import { writable } from 'svelte/store'
import lrcParser from 'lrc-parser'

export const media = writable<File | null>(null)
export const mediaUrl = writable<string | null>(null)
media.subscribe((file) => {
  if (file) {
    mediaUrl.set(URL.createObjectURL(file))
  }
})

export const rawLrc = writable<string | null>(null)
export const lrc = writable<ReturnType<typeof lrcParser> | null>(null)
