const fs = require('fs');
const { VM } = require('vm2');

const MAIN_FILE = __dirname + '/../src/index.js';
const MAIN_CONTENT = fs.readFileSync(MAIN_FILE, 'utf8');

const app = {
  getCompanyInformation() {
    return { Id: 1, Name: 'TestCompany' };
  },
  getAppConfig() {
    return {
      projectKey: 'AB'
    }
  },
  setAppConfig(val) {
    return true;
  }
};
const ITFinApp = {
  createCommunityApp: () => {
    return app;
  }
};
const Request = {
  post: jest.fn()
}

function runTest(code) {
  const vm = new VM({
    console: 'inherit',
    sandbox: {
      require: require,
      module: {},
      exports: {},
      ITFinApp,
      Request
    },
  });
  return vm.run(`${MAIN_CONTENT} ${code}`);
}

test('onEvent', async () => {
  const data = { Id: 1, FirstName: 'Test', Position: { Id: 1, Name: 'Developer' } }
  await runTest(`onEvent("employees:created", ${JSON.stringify(data)});`);

  expect(Request.post).toHaveBeenCalledWith('https://admin.googleapis.com/admin/directory/v1/users', {"addresses": [], "changePasswordAtNextLogin": true, "email": [{"address": undefined, "customType": "", "primary": true, "type": "home"}], "externalIds": [{"customType": "itfin", "type": "custom", "value": "1"}], "hashFunction": "SHA-1", "ims": [], "includeInGlobalAddressList": true, "ipWhitelisted": false, "name": {"familyName": undefined, "givenName": "Test"}, "password": "40bd001563085fc35165329ea1ff5c5ecbdbbeef", "phones": [], "primaryEmail": undefined, "suspended": true})
});
