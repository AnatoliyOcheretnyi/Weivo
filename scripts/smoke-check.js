/* eslint-disable no-console */
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = process.cwd()

const fail = (message) => {
  console.error(`SMOKE CHECK FAILED: ${message}`)
  process.exit(1)
}

const readJson = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch (error) {
    fail(`Cannot read JSON file ${filePath}: ${String(error)}`)
  }
}

const readText = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (error) {
    fail(`Cannot read file ${filePath}: ${String(error)}`)
  }
}

const fileExists = (filePath) => fs.existsSync(filePath)

const appJsonPath = path.join(projectRoot, 'app.json')
const iosFirebasePath = path.join(projectRoot, 'ios', 'GoogleService-Info.plist')
const androidFirebasePath = path.join(projectRoot, 'android', 'app', 'google-services.json')
const iosProjectPath = path.join(projectRoot, 'ios', 'Weivo.xcodeproj', 'project.pbxproj')

if (!fileExists(appJsonPath)) {
  fail('app.json not found')
}
if (!fileExists(iosFirebasePath)) {
  fail('ios/GoogleService-Info.plist not found')
}
if (!fileExists(androidFirebasePath)) {
  fail('android/app/google-services.json not found')
}
if (!fileExists(iosProjectPath)) {
  fail('ios/Weivo.xcodeproj/project.pbxproj not found')
}

const appJson = readJson(appJsonPath)
const iosBundleId = appJson?.expo?.ios?.bundleIdentifier
const androidPackage = appJson?.expo?.android?.package

if (!iosBundleId) {
  fail('expo.ios.bundleIdentifier is missing in app.json')
}
if (!androidPackage) {
  fail('expo.android.package is missing in app.json')
}

const plistText = readText(iosFirebasePath)
if (!plistText.includes(`<string>${iosBundleId}</string>`)) {
  fail(`Firebase iOS config bundle id does not match app.json (${iosBundleId})`)
}

const iosProjectText = readText(iosProjectPath)
if (!iosProjectText.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${iosBundleId};`)) {
  fail(`Xcode project bundle id is not synced with app.json (${iosBundleId})`)
}

const androidFirebase = readJson(androidFirebasePath)
const clients = Array.isArray(androidFirebase.client) ? androidFirebase.client : []
const hasMatchingAndroidClient = clients.some(
  (client) => client?.client_info?.android_client_info?.package_name === androidPackage
)
if (!hasMatchingAndroidClient) {
  fail(`Firebase Android config has no client for ${androidPackage}`)
}

console.log('Smoke checks passed.')
