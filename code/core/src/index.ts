import OBSWebSocket from 'obs-websocket-js'
import { Config } from "@obs-hook/models"

export class ObsHook {
  readonly _obs: OBSWebSocket
  readonly _config: Config
  constructor (config: Config) {
    console.log('ObsHook')
    this._obs = new OBSWebSocket()
    this._config = config
  }

  public async connect (): Promise<void> {
    this._obs.connect()
  }
}
