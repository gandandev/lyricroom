import { writable } from 'svelte/store'

export const media = writable<File | null>(null)
export const rawLrc = writable<string | null>(null)
