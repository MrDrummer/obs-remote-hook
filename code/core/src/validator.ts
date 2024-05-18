import { Audio, Config, Layout, Scene } from "@obs-hook/models";

export class ConfigHelper {
  readonly _config: Config
  constructor (config: Config) {
    this._config = config
  }

  public isAudio (audioSlug: string): boolean {
    return this._config.audio.find(a => a.slug === audioSlug) != null
  }

  public isScene (sceneSlug: string): boolean {
    return this._config.scenes.find(sc => sc.slug === sceneSlug) != null
  }

  public isLayout (layoutSlug: string): boolean {
    return this._config.layouts.find(l => l.slug === layoutSlug) != null
  }

  public isSlot (slotSlug: string): boolean {
    return this._config.slots.find(s => s.slug === slotSlug) != null
  }

  public sourceBelongsToSlot (slotSlug: string, sceneSlug: string): boolean {
    return this._config.slots.find(s => s.slug === slotSlug)?.scenes.includes(sceneSlug) ?? false
  }

  public slotBelongsToLayout (layoutSlug: string, slotSlug: string): boolean {
    return this._config.layouts.find(l => l.slug === layoutSlug)?.slots.includes(slotSlug) ?? false
  }

  public getSceneFromSlug (sceneSlug: string): Scene | undefined {
    return this._config.scenes.find(sc => sc.slug === sceneSlug)
  }

  public getLayoutFromSlug (layoutSlug: string): Layout | undefined {
    return this._config.layouts.find(l => l.slug === layoutSlug)
  }

  public getSlotFromSlug (slotSlug: string): Scene | undefined {
    return this._config.slots.find(s => s.slug === slotSlug)
  }

  public getAudioFromSlug (audioSlug: string): Audio | undefined {
    return this._config.audio.find(a => a.slug === audioSlug)
  }

  public getSlotsThatUseScene (sceneSlug: string): Scene[] {
    return this._config.slots.filter(s => s.scenes.includes(sceneSlug))
  }

  public getLayoutsThatUseSlot (slotSlug: string): Layout[] {
    return this._config.layouts.filter(l => l.slots.includes(slotSlug))
  }
}
