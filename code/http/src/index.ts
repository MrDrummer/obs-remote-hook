import { ObsHook } from "@obs-hook/core"
import YAML from "yaml"

import fs from "fs"
import path from "path"
import { BaseSecrets, Config } from "@obs-hook/models"
import { HttpHandler } from "./handler"

const parseYaml = <T> (relativePath: string): T => {
  const filePath = path.join(__dirname, relativePath)

  console.log('filePath :', filePath)

  const file = fs.readFileSync(filePath, "utf8")
  const data: T = YAML.parse(file)
  return data
}

const run = async () => {
  const configDir = "../../../config"
  const obsConfig: Config = parseYaml<Config>(`${ configDir }/config.yaml`)
  console.log('obsConfig :', obsConfig)
  const obsSecrets: BaseSecrets = parseYaml<BaseSecrets>(`${ configDir }/secrets.yaml`)
  console.log('obsSecrets :', obsSecrets)

  const hook = new ObsHook(obsConfig, obsSecrets)

  const obsHandler = new HttpHandler(hook, 3030)

  await obsHandler.setup()

  await hook.getAllAudioSources()
}

run()
