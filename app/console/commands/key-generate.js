import config from "../../../config/app.js";
import { generateKey } from "../../supports/helpers.js";
import { Str } from "../../supports/Str.js";
import fs from "fs";
import minimist from "minimist";
import { EOL } from "os";

/**
 * Read .env file & convert to array.
 *
 * @param {string} envFilePath
 */
function readEnvVars(envFilePath) {
  return fs.readFileSync(envFilePath, "utf-8").split(EOL);
}

/**
 * Updates value for existing key or creates a new key=value line
 *
 * This function is a modified version of https://stackoverflow.com/a/65001580/3153583
 *
 * @param {string} key Key to update/insert.
 * @param {string} value Value to update/insert.
 * @param {string | null} envFilePath
 */
const setEnvValue = (key, value, envFilePath) => {
  envFilePath ||= ".env";

  const envVars = readEnvVars(envFilePath);
  const targetLine = envVars.find(line => line.split("=")[0] === key);
  const keyValuePair = `${key}=${value}`;

  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);

    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, keyValuePair);
  } else {
    // create new key value
    envVars.push(keyValuePair);
  }

  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(EOL));
};

const appKey = `base64:${generateKey(config.cipher)}`;
const csrfKey = Str.randomAlphaNumeric(32);
const cookieKey = Str.randomAlphaNumeric(32);
const sessionKey = Str.randomAlphaNumeric(32);
const terminalArguments = minimist(process.argv.slice(2));

if (terminalArguments?.show || false) {
  console.log("appKey", appKey);
  console.log("csrfKey", csrfKey);
  console.log("cookieKey", cookieKey);
  console.log("sessionKey", sessionKey);
} else {
  setEnvValue("APP_KEY", appKey, terminalArguments?.source_path);
  setEnvValue("CSRF_KEY", csrfKey, terminalArguments?.source_path);
  setEnvValue("COOKIE_KEY", cookieKey, terminalArguments?.source_path);
  setEnvValue("SESSION_KEY", sessionKey, terminalArguments?.source_path);
}
