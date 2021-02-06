const CLIENT_ID = '0oad16p8oaHewFPbh4x6';
const ISSUER = 'https://apexheartcare.okta.com/oauth2/default';
const OKTA_TESTING_DISABLEHTTPSCHECK = false;

export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: 'https://react.korlakunta.com/implicit/callback',
    //redirectUri: 'http://localhost:3000/implicit/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
  },
  resourceServer: {
    //messagesUrl: 'http://localhost:3000/api/messages',
    messagesUrl: 'https://react.korlakunta.com/api/messages',
  },
};

export const config = {
  appId: '153d845a-dffd-4f2b-b025-bfce367e8772',
  redirectUri: 'http://localhost:3000',
  scopes: [
    'user.read',
    'mailboxsettings.read',
    'calendars.readwrite'
  ]
};

