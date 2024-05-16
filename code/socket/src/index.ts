import { ObsHook } from "@obs-hook/core"
// import { Config } from "@obs-hook/models"

const hook = new ObsHook({
  cut: 'cut',
  audio: [
    { slug: 'audio1', desc: 'audio1', source: 'source1' }
  ],
  scenes: [
    { slug: 'scene1', desc: 'scene1', scene: 'scene1' }
  ],
  layouts: [
    { slug: 'layout1', desc: 'layout1', scene: 'scene1', slots: ['slot1'] }
  ],
  slots: [
    { slug: 'slot1', desc: 'slot1', scene: 'scene1', scenes: ['scene1'] }
  ]
})

// hook.doThing()
