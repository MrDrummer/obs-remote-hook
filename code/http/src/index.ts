import { ObsHook } from "@obs-hook/core"
import YAML from "yaml"

import fs from "fs"
import path from "path"
import { BaseSecrets, Config } from "@obs-hook/models"
import { HttpHandler } from "./handler"

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

  const obsHandler = new HttpHandler(hook)

  await obsHandler.setup()

  await hook.getAllAudioSources()
}

run()
