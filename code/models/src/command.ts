import { Config } from "./config"

export interface Command {
  command: string
}

export interface Cut extends Command {
  command: "cut"
}

export interface SetLayout extends Command {
  command: "setLayout"
  sceneSlug: string
}

export interface SetSlot extends Command {
  command: "setSlot"
  slotSlug: string
  sourceSlug: string
}


export interface Mute extends Command {
  command: "mute"
  sourceSlug: string
  mute: boolean
}

export interface MuteAll extends Command {
  command: "muteAll"
  mute: boolean
}

export interface IncreaseAudio extends Command {
  command: "increaseAudio"
  sourceSlug: string
  percentageChange: number
}

export interface DecreaseAudio extends Command {
  command: "decreaseAudio"
  sourceSlug: string
  percentageChange: number
}

export interface SetAudio extends Command {
  command: "setAudio"
  sourceSlug: string
  percentage: number
}

export interface StartStream extends Command {
  command: "startStream"
}

export interface StopStream extends Command {
  command: "stopStream"
}

export interface GetConfig extends Command {
  command: "getConfig"
}

export type ObsCommand = Cut | SetLayout | SetSlot | Mute | MuteAll | IncreaseAudio | DecreaseAudio | SetAudio | StartStream | StopStream | GetConfig


export interface IncreaseAudioResult {
  command: "increaseAudio"
  result: number
}

export interface DecreaseAudioResult {
  command: "decreaseAudio"
  result: number
}

export interface ConfigResult {
  command: "getConfig"
  result: Config
}

export type ObsCommandResult = IncreaseAudioResult | DecreaseAudioResult | ConfigResult
