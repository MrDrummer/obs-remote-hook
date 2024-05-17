import { ObsHook } from "@obs-hook/core";
import { Config, IHandler } from "@obs-hook/models"
import { ObsCommand } from "@obs-hook/models/dist/command"

export class ObsHandler implements IHandler {
  private _obsHook: ObsHook
  constructor (obsHook: ObsHook) {
    this._obsHook = obsHook
  }
  async setup (): Promise<void> {
    await this._obsHook.connect()
  }
  async cut (): Promise<void> {
    this._obsHook.cut()
  }
  async setLayout (sceneSlug: string): Promise<void> {
    this._obsHook.setLayout(sceneSlug)
  }
  async setSlot (slotSlug: string, sourceSlug: string): Promise<void> {
    this._obsHook.setSlot(slotSlug, sourceSlug)
  }
  async muteAudio (sourceSlug: string, mute: boolean): Promise<void> {
    this._obsHook.muteAudio(sourceSlug, mute)
  }
  async muteAllAudio (mute: boolean): Promise<void> {
    this._obsHook.muteAllAudio(mute)
  }
  async increaseAudio (sourceSlug: string, percentageChange: number): Promise<number> {
    console.log('sourceSlug, percentageChange :', sourceSlug, percentageChange)
    return 0
    // return this._obsHook.changeAudio(sourceSlug, percentageChange)
  }
  async decreaseAudio (sourceSlug: string, percentageChange: number): Promise<number> {
    // return this._obsHook.changeAudio(sourceSlug, -percentageChange)
    console.log('sourceSlug, percentageChange :', sourceSlug, percentageChange)
    return 0
  }
  async setAudio (sourceSlug: string, percentage: number): Promise<void> {
    console.log('sourceSlug, percentage :', sourceSlug, percentage)
    // this._obsHook.setAudio(sourceSlug, percentage)
  }
  async startStream (): Promise<void> {
    // this._obsHook.startStream()
  }
  async stopStream (): Promise<void> {
    // this._obsHook.stopStream()
  }

  async executeCommand (command: ObsCommand): Promise<number | Config | void> {
    switch (command.command) {
      case "cut":
        return this.cut()
      case "setLayout":
        return this.setLayout(command.sceneSlug)
      case "setSlot":
        return this.setSlot(command.slotSlug, command.sourceSlug)
      case "muteAudio":
        return this.muteAudio(command.sourceSlug, command.mute)
      case "muteAllAudio":
        return this.muteAllAudio(command.mute)
      case "increaseAudio":
        return this.increaseAudio(command.sourceSlug, command.percentageChange)
      case "decreaseAudio":
        return this.decreaseAudio(command.sourceSlug, command.percentageChange)
      case "setAudio":
        return this.setAudio(command.sourceSlug, command.percentage)
      case "startStream":
        return this.startStream()
      case "stopStream":
        return this.stopStream()
      default:
        throw new Error(`Unknown command: ${ command }`)
    }
  }

}
