const request = require('request');
const manifestJson = require('../manifest.json');
const packageJson = require('../package.json');
const path = require('path');
const fs = require('fs');

const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip');

function bootstrap() {
  const { DEPLOY_TOKEN, ITFIN_DOMAIN } = process.env;
  if (!DEPLOY_TOKEN) {
    console.error('DEPLOY_TOKEN is not set');
    return;
  }
  const URL_UPLOAD = `https://${ITFIN_DOMAIN || 'app.itfin.io'}/api/v1/apps/deploy`;
  
  const { name } = manifestJson;
  const { version } = packageJson;
  const zipFilename = `${DEST_ZIP_DIR}/${name}-v${version}.zip`

  const options = {
    url: `${URL_UPLOAD}/${name}`,
    headers: { 'Authorization': DEPLOY_TOKEN }
  };
  const req = request.post(options, function (err, resp, body) {
    if (err) {
      return console.info(err);
    }
    console.info('Successfully uploaded package.');
  });
  const form = req.form();
  form.append('file', fs.createReadStream(zipFilename));
}

bootstrap();
