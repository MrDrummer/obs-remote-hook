import { ObsHook } from "@obs-hook/core"
import YAML from "yaml"

import fs from "fs"
import path from "path"
import { BaseSecrets, Config } from "@obs-hook/models"

const parseYaml = <T> (relativePath: string): T => {
  const filePath = path.join(__dirname, relativePath)

  const file = fs.readFileSync(filePath, "utf8")
  const data: T = YAML.parse(file)
  return data
}

const run = async () => {
  const configDir = "../../../config"
  const obsConfig: Config = parseYaml<Config>(`${ configDir }/config.yaml`)
  const obsSecrets: BaseSecrets = parseYaml<BaseSecrets>(`${ configDir }/secrets.yaml`)

  const hook = new ObsHook(obsConfig, obsSecrets)

  // const on = hook._obs.on.bind(hook._obs)
  // const call = hook._obs.call.bind(hook._obs)

  await hook.connect()

  // const version = await call("GetVersion")
  // console.log('version :', version)

  await hook.setLayout("LAYOUT_PIP")

  // const scene = await hook.getSceneItems("Slot 1")
  // console.log('scene :', scene)

  await hook.setSlot("SLOT_PRIMARY", "RAW_CAB")
  await hook.setSlot("SLOT_BOTTOM", "RAW_ROAD")
}

run()
