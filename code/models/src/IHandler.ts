import { Config } from "./config"

export interface IHandler {
  setup (): Promise<void>
  cut (): Promise<void>
  setLayout (sceneSlug: string): Promise<void>
  setSlot (slotSlug: string, sourceSlug: string): Promise<void>
  mute (sourceSlug: string, mute: boolean): Promise<void>
  muteAll (mute: boolean): Promise<void>
  increaseAudio (sourceSlug: string, percentageChange: number): Promise<number>
  decreaseAudio (sourceSlug: string, percentageChange: number): Promise<number>
  setAudio (sourceSlug: string, percentage: number): Promise<void>
  startStream (): Promise<void>
  stopStream (): Promise<void>
  getConfig (): Config
}
