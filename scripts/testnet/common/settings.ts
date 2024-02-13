import { settings as settingsLocal } from "../localhost/settings.localhost"
import { settings as settingsBsc } from "../bsc/settings.bsctestnet"
import { logger } from "../../utilities/log"
logger.debug(`load settings - process.env.HARDHAT_NETWORK: ${process.env.HARDHAT_NETWORK}`)
export let settings: any
if (process.env.HARDHAT_NETWORK == "localhost" || process.env.HARDHAT_NETWORK == "hardhat") {
  logger.debug("load settingsLocal")
  settings = settingsLocal
} else {
  logger.debug("load settingsBsc")
  settings = settingsBsc
}
