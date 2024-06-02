import OBSWebSocket, { EventSubscription, RequestBatchRequest } from 'obs-websocket-js'
import { BaseSecrets, Config } from "@obs-hook/models"
import { ObsSceneItem } from "./obs"
import { ConfigHelper } from "./validator"
export { ConfigHelper } from "./validator"

export interface IObsHook {
  connect (): Promise<void>
}

export class ObsHook implements IObsHook {
  readonly _obs: OBSWebSocket
  readonly _config: Config
  private readonly _secrets: BaseSecrets
  private _configHelper: ConfigHelper

  constructor (config: Config, secrets: BaseSecrets) {
    console.log('ObsHook')
    this._obs = new OBSWebSocket()
    this._config = config
    this._secrets = secrets
    this._configHelper = new ConfigHelper(config)
  }

  public async connect (): Promise<void> {
    const connectionString = `ws://${ this._secrets.obs.hostname }:${ this._secrets.obs.port }`
    console.log('connectionString :', connectionString)
    await this._obs.connect(connectionString, this._secrets.obs.password, {
      eventSubscriptions: EventSubscription.All,
      rpcVersion: 1
    })
  }

  public async cut (): Promise<void> {
    const sceneSlug = this._config.cut
    const sceneConfig = this._configHelper.getSceneFromSlug(sceneSlug)

    if (sceneConfig == null) {
      throw new Error(`Scene ${ sceneSlug } not found`)
    }

    await this._obs.call("SetCurrentProgramScene", { sceneName: sceneConfig.scene })
  }

  public async setLayout (sceneSlug: string): Promise<void> {
    const sceneConfig = this._configHelper.getLayoutFromSlug(sceneSlug) ?? this._configHelper.getSceneFromSlug(sceneSlug)
    if (sceneConfig == null) {
      throw new Error(`Layout ${ sceneSlug } not found`)
    }
    await this._obs.call("SetCurrentProgramScene", { sceneName: sceneConfig.scene })
    console.info('Layout set to :', sceneConfig.scene)
  }

  public async getSceneItems (sceneSlug: string): Promise<ObsSceneItem[]> {

    const out = await this._obs.call("GetSceneItemList", { sceneName: sceneSlug })
    return out.sceneItems as unknown as ObsSceneItem[]
  }

  public async setSlot (slotSceneSlug: string, sourceSlug: string): Promise<void> {
    const slotConfig = this._configHelper.getSlotFromSlug(slotSceneSlug)

    if (slotConfig == null) {
      throw new Error(`Slot ${ slotSceneSlug } not found`)
    }

    const isSlotSource = this._configHelper.sourceBelongsToSlot(slotSceneSlug, sourceSlug)

    if (isSlotSource == null) {
      throw new Error(`Source ${ sourceSlug } does not belong to slot ${ slotSceneSlug }`)
    }

    // console.log('slotConfig, sourceSlug :', slotConfig, sourceSlug)


    // Need to get the existing scene items in order to get the sceneItemId.
    const sceneItems = await this.getSceneItems(slotConfig.scene)

    const sourceConfig = this._configHelper.getSceneFromSlug(sourceSlug) ?? this._configHelper.getSlotFromSlug(sourceSlug)

    if (sourceConfig == null) {
      throw new Error(`Scene ${ sourceSlug } not found`)
    }

    // console.log('sceneItems :', sceneItems)

    const toEnable = sceneItems.find((sceneItem) => sceneItem.sourceName === sourceConfig.scene)

    if (toEnable == null) {
      throw new Error(`Source ${ sourceSlug } not found in scene ${ slotSceneSlug }`)
    }

    const changes: RequestBatchRequest[] = []


    // Only enable if it isn't already enabled.
    if (!toEnable.sceneItemEnabled) {
      console.log('toEnable :', toEnable.sceneItemId)
      changes.push({ requestType: "SetSceneItemEnabled", requestData: { sceneItemId: toEnable.sceneItemId, sceneName: slotConfig.scene, sceneItemEnabled: true } })
    } else {
      console.log('source already enabled :', toEnable.sceneItemId)
    }

    const toDisable = sceneItems.filter((sceneItem) => sceneItem.sceneItemEnabled && sceneItem.sceneItemId !== toEnable.sceneItemId).map(sc => sc.sceneItemId)

    console.log('toDisable :', toDisable)
    for (const sceneItemId of toDisable) {
      changes.push({ requestType: "SetSceneItemEnabled", requestData: { sceneItemId, sceneName: slotConfig.scene, sceneItemEnabled: false } })
    }

    await this._obs.callBatch(changes)
  }

  public async muteAudio (sourceSlug: string, mute: boolean): Promise<void> {
    const audioConfig = this._configHelper.getAudioFromSlug(sourceSlug)

    if (audioConfig == null) {
      throw new Error(`Audio ${ sourceSlug } not found`)
    }

    await this._obs.call("SetInputMute", { inputName: sourceSlug, inputMuted: mute })
  }

  public async getAllAudioSources (): Promise<number> {
    const out = await this._obs.call("GetInputAudioBalance", { inputName: "RAW_CAM_1" })

    return out.inputAudioBalance
  }

  public async muteAllAudio (mute: boolean): Promise<void> {
    console.log('mute :', mute)
    // await this._obs.call("SetMute", { source: "all", mute })
  }

  public getConfig (): Config {
    return this._config
  }

  // public async changeAudio (source: string, percentageChange: number): Promise<number> {
  // const isAudio = this._configHelper.isAudio(source)

  // if (!isAudio) {
  //   throw new Error(`Audio ${ source } not found`)
  // }

  // const out = await this._obs.call("SetInputVolume", { inputName: source, inputVolumeDb:  })

  // return out.volume
  // }
}
