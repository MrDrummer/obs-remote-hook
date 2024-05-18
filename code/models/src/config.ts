
export interface Config {
  cut: string
  allowStart: boolean
  allowStop: boolean
  audio: Audio[]
  scenes: Scene[]
  layouts: Layout[]
  slots: Slot[]
}


export interface BaseEntity {
  slug: string
  desc: string
}

export interface Scene extends BaseEntity {
  scene: string
}

export interface Audio extends BaseEntity {
  source: string
}

export interface Layout extends Scene {
  slots: string[]
}

export interface Slot extends Scene {
  scenes: string[]
}
