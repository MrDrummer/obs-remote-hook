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


export interface MuteAudio extends Command {
  command: "muteAudio"
  sourceSlug: string
  mute: boolean
}

export interface MuteAllAudio extends Command {
  command: "muteAllAudio"
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

export type ObsCommand = Cut | SetLayout | SetSlot | MuteAudio | MuteAllAudio | IncreaseAudio | DecreaseAudio | SetAudio | StartStream | StopStream | GetConfig
