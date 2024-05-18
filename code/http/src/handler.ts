import { ObsHook } from "@obs-hook/core";
import { Config, IHandler, ObsCommandResult } from "@obs-hook/models"
import { ObsCommand } from "@obs-hook/models"
import express, { Express } from "express"

export class HttpHandler implements IHandler {
  private _obsHook: ObsHook
  private _express: Express
  private _expressPort: number

  constructor (obsHook: ObsHook, port: number = 3000) {
    this._obsHook = obsHook

    this._express = express()

    this._expressPort = port
  }
  async setup (): Promise<void> {
    await this._obsHook.connect()

    this._express.use(express.json())
    this._express.post("/command", async (req, res) => {
      const command = req.body as ObsCommand[]
      try {
        const results: ObsCommandResult[] = []

        for (const c of command) {
          console.log("==========")
          console.log('command :', c)
          const result = await this.executeCommand(c)
          if ((c.command === "increaseAudio" || c.command === "decreaseAudio" || c.command === "getConfig") && (result != null)) {
            results.push({ command: c.command, result } as ObsCommandResult) //TODO: No clue how to remove the need to cast here
          }
        }

        res.send(results)
      } catch (e) {
        console.error('ObsHandler /command error :', e)
        res.status(500).send("There was an error.")
      }
    })

    this._express.listen(this._expressPort, () => {
      console.log(`Server is running on http://localhost:${ this._expressPort }`);
    })
  }
  async cut (): Promise<void> {
    this._obsHook.cut()
  }
  async setLayout (sceneSlug: string): Promise<void> {
    return this._obsHook.setLayout(sceneSlug)
  }
  async setSlot (slotSlug: string, sourceSlug: string): Promise<void> {
    return this._obsHook.setSlot(slotSlug, sourceSlug)
  }
  async muteAudio (sourceSlug: string, mute: boolean): Promise<void> {
    return this._obsHook.muteAudio(sourceSlug, mute)
  }
  async muteAllAudio (mute: boolean): Promise<void> {
    return this._obsHook.muteAllAudio(mute)
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

  getConfig (): Config {
    return this._obsHook.getConfig()
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
      case "getConfig":
        return this.getConfig()
      default:
        throw new Error(`Unknown command: ${ command }`)
    }
  }

}
