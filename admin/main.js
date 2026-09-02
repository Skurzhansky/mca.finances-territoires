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
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="admin-shell">
      <header class="admin-topbar">
        <span>Connecté : ${user.profile?.email || ''}</span>
        <button id="signOut" class="btn">Se déconnecter</button>
      </header>
      <p id="s3-status">Vérification de l'accès S3…</p>
    </div>`;
  document.getElementById('signOut').addEventListener('click', () => signOutRedirect());

  const status = document.getElementById('s3-status');
  try {
    const { S3Client, ListObjectsV2Command } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/client-s3@3/+esm');
    const credentials = await getCredentials(user.id_token);
    const s3 = new S3Client({ region: config.region, credentials });
    await s3.send(new ListObjectsV2Command({ Bucket: config.bucket, MaxKeys: 1 }));
    status.textContent = 'Accès S3 confirmé — la publication sera bientôt disponible ici.';
  } catch (err) {
    status.textContent = `Erreur d'accès S3 : ${err.message}`;
    console.error(err);
  }
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
