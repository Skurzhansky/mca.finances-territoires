import { UserManager } from 'https://cdn.jsdelivr.net/npm/oidc-client-ts@3/+esm';
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

// Le jeton d'identité Cognito expire au bout d'une heure. Les accès AWS
// temporaires sont renouvelés à partir de ce jeton : on fournit donc une
// fonction qui renvoie à chaque fois un jeton valide, rafraîchi au besoin
// grâce au refresh token (sans nouvelle connexion). Sans cela, toute
// publication faite plus d'une heure après la connexion échouait
// (« Invalid login token. Token expired »).
async function freshIdToken() {
  let user = await userManager.getUser();
  const expiresSoon = !user || user.expired || (typeof user.expires_in === 'number' && user.expires_in < 120);
  if (expiresSoon && user?.refresh_token) {
    try { user = await userManager.signinSilent(); } catch (err) { console.warn('Renouvellement de session impossible', err); }
  }
  if (!user || user.expired || !user.id_token) throw new Error('SESSION_EXPIRED');
  return user.id_token;
}

async function getCredentials() {
  const { fromCognitoIdentityPool } = await import('https://cdn.jsdelivr.net/npm/@aws-sdk/credential-providers@3/+esm');
  return fromCognitoIdentityPool({
    clientConfig: { region: config.region },
    identityPoolId: config.cognito.identityPoolId,
    logins: {
      [`cognito-idp.${config.region}.amazonaws.com/${config.cognito.userPoolId}`]: freshIdToken,
    },
  });
}

function renderLoggedOut() {
  document.getElementById('app').innerHTML = `
    <div class="admin-login">
      <h1>Administration</h1>
      <p>Connectez-vous pour gérer le contenu du site : accueil, expertises, secteurs, guide et événements.</p>
      <button id="signIn" class="btn btn--site btn-primary">Se connecter</button>
    </div>`;
  document.getElementById('signIn').addEventListener('click', () => userManager.signinRedirect());
}

async function renderLoggedIn(user) {
  const credentials = await getCredentials();
  const { mountAdmin } = await import('./app.js?v=20261126d');
  await mountAdmin(document.getElementById('app'), { user, credentials, signOut: signOutRedirect, reauth: () => userManager.signinRedirect() });
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

  let user = await userManager.getUser();
  if (user && user.expired && user.refresh_token) {
    try { user = await userManager.signinSilent(); } catch (err) { console.warn(err); }
  }
  if (user && !user.expired) {
    await renderLoggedIn(user);
  } else {
    renderLoggedOut();
  }
}

main();
