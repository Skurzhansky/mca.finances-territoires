import { UserManager } from 'https://cdn.jsdelivr.net/npm/oidc-client-ts@3/dist/browser/oidc-client-ts.min.js';
import { config } from './config.js';

const settings = {
  authority: `https://cognito-idp.${config.region}.amazonaws.com/${config.cognito.userPoolId}`,
  client_id: config.cognito.clientId,
  redirect_uri: config.redirectUri,
  response_type: 'code',
  scope: 'openid email profile',
};

export const userManager = new UserManager(settings);

export function signOutRedirect() {
  const cognitoDomain = `https://${config.cognito.domain}`;
  const url = `${cognitoDomain}/logout?client_id=${config.cognito.clientId}&logout_uri=${encodeURIComponent(config.redirectUri)}`;
  window.location.href = url;
}

async function getCredentials(idToken) {
  const { fromCognitoIdentityPool } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/credential-providers@3/+esm');
  return fromCognitoIdentityPool({
    clientConfig: { region: config.region },
    identityPoolId: config.cognito.identityPoolId,
    logins: {
      [`cognito-idp.${config.region}.amazonaws.com/${config.cognito.userPoolId}`]: idToken,
    },
  });
}

function renderLoggedOut() {
  document.getElementById('app').innerHTML = `
    <div class="admin-login">
      <h1>Administration</h1>
      <p>Connectez-vous pour éditer le Guide et les Événements.</p>
      <button id="signIn" class="btn btn--site btn-primary">Se connecter</button>
    </div>`;
  document.getElementById('signIn').addEventListener('click', () => userManager.signinRedirect());
}

async function renderLoggedIn(user) {
  const credentials = await getCredentials(user.id_token);
  const { mountAdmin } = await import('./app.js');
  await mountAdmin(document.getElementById('app'), { user, credentials, signOut: signOutRedirect });
}

async function main() {
  if (window.location.search.includes('code=')) {
    try {
      const user = await userManager.signinCallback();
      window.history.replaceState({}, document.title, config.redirectUri);
      await renderLoggedIn(user);
      return;
    } catch (err) {
      console.error(err);
    }
  }

  const user = await userManager.getUser();
  if (user && !user.expired) {
    await renderLoggedIn(user);
  } else {
    renderLoggedOut();
  }
}

main();
