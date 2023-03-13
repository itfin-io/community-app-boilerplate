const app = ITFinApp.createCommunityApp();

const BASE_URL = 'https://admin.googleapis.com';

async function onEvent(name, params) {
  const config = await app.getAppConfig();
  switch (name) {
    case 'employees:created':
      return createNewUser(config, params);
  }
  return true;
}

async function createNewUser(config, {
  Id,
  Email,
  FirstName,
  LastName,
  PersonalEmail,
  Position,
  Phone,
  Sex
}) {
  const user = {
    primaryEmail: Email,
    name: {
      givenName: FirstName,
      familyName: LastName
    },
    suspended: true,
    password: "40bd001563085fc35165329ea1ff5c5ecbdbbeef", // 123
    hashFunction: "SHA-1",
    changePasswordAtNextLogin: true,
    ipWhitelisted: false,
    ims: [],
    email: [
      {
        "address": PersonalEmail,
        "type": "home",
        "customType": "",
        "primary": true
      }
    ],
    addresses: [],
    externalIds: [
      {
        "value": Id.toString(),
        "type": "custom",
        "customType": "itfin"
      }
    ],
    phones: [],
    "includeInGlobalAddressList": true
  };
  if (Phone) {
    user.phones.push({
      "value": Phone,
      "type": "work"
    })
  }
  if (Sex) {
    user.gender = { type: Sex.toLowerCase() }; 
  }
  return Request.post(`${BASE_URL}/admin/directory/v1/users`, user);
}
