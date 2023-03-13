#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
// eslint-disable-next-line
var archiver = require('archiver')

const MANIFEST_FILE = 'manifest.json'
const manifestJson = require('../manifest.json');
const packageJson = require('../package.json');

const DEST_DIR = path.join(__dirname, '../dist')
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip')

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR)
  }
}

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`);

  const distManifest = path.join(DEST_DIR, MANIFEST_FILE);
  const data = fs.readFileSync (path.join(__dirname, `../${MANIFEST_FILE}`));

  const packageJsonObj = JSON.parse(data);
  packageJsonObj.version = packageJson.version;

  fs.writeFileSync(distManifest, JSON.stringify(packageJsonObj));

  const output = fs.createWriteStream(path.join(dist, zipFilename))
  const archive = archiver('zip');
  archive.pipe(output);
  archive.file(distManifest, { name: MANIFEST_FILE });
  if (manifestJson.image) {
    archive.file(path.join(__dirname, `../${manifestJson.image}`), { name: manifestJson.image });
  }
  archive.directory(src, 'dist')
  archive.finalize()
}

const main = () => {
  const { name } = manifestJson;
  const { version } = packageJson;
  const zipFilename = `${name}-v${version}.zip`

  makeDestZipDirIfNotExists()

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
}

main()
