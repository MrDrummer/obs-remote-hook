import OBSWebSocket, { EventSubscription } from 'obs-websocket-js'
import { BaseSecrets, Config } from "@obs-hook/models"
import { ObsSceneItem } from "./obs"

export interface IObsHook {
  connect (): Promise<void>
}

export class ObsHook implements IObsHook {
  readonly _obs: OBSWebSocket
  readonly _config: Config
  private readonly _secrets: BaseSecrets

  constructor (config: Config, secrets: BaseSecrets) {
    console.log('ObsHook')
    this._obs = new OBSWebSocket()
    this._config = config
    this._secrets = secrets
  }

  public async connect (): Promise<void> {
    const connectionString = `ws://${ this._secrets.obs.hostname }:${ this._secrets.obs.port }`
    console.log('connectionString :', connectionString)
    await this._obs.connect(connectionString, this._secrets.obs.password, {
      eventSubscriptions: EventSubscription.All,
      rpcVersion: 1
    })
  }

  public async setLayout (sceneName: string): Promise<void> {
    await this._obs.call("SetCurrentProgramScene", { sceneName })
  }

  public async getSceneItems (scene: string): Promise<ObsSceneItem[]> {
    const out = await this._obs.call("GetSceneItemList", { sceneName: scene })
    return out.sceneItems as unknown as ObsSceneItem[]
  }

  public async setSlot (slotScene: string, source: string): Promise<void> {
    const sceneItems = await this.getSceneItems(slotScene)

    const toEnable = sceneItems.find((sceneItem) => sceneItem.sourceName === source)?.sceneItemId

    if (!toEnable) {
      throw new Error(`Source ${ source } not found in scene ${ slotScene }`)
    }

    console.log('toEnable :', toEnable)
    await this._obs.call("SetSceneItemEnabled", { sceneItemId: toEnable, sceneName: slotScene, sceneItemEnabled: true })

    const toDisable = sceneItems.filter((sceneItem) => sceneItem.sceneItemEnabled).map(sc => sc.sceneItemId)

    console.log('toDisable :', toDisable)
    for (const sceneItemId of toDisable) {
      if (sceneItemId !== toEnable) {
        await this._obs.call("SetSceneItemEnabled", { sceneItemId, sceneName: slotScene, sceneItemEnabled: false })
      }
    }

  }
}
