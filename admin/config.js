// Configuration de l'admin — identifiants publics uniquement (aucun secret ici).
// Cette page tourne entièrement côté navigateur : pas de backend, pas de clé
// AWS permanente. L'authentification passe par Cognito (Hosted UI + OIDC),
// puis le jeton obtenu est échangé contre des accès AWS temporaires via
// l'Identity Pool, limités par la policy IAM du rôle authentifié (lecture/
// écriture sur ce bucket uniquement).

export const config = {
  region: 'eu-west-3',
  bucket: 'site-finances-territoires',
  siteUrl: 'https://site.id.finances-territoires.fr',

  cognito: {
    userPoolId: 'eu-west-3_uBzlHSKjV',
    clientId: '75u6h3iaov9ldcaehvpv0m0pji',
    identityPoolId: 'eu-west-3:50faab90-97ce-44d8-90d6-c69245f59161',
    domain: 'eu-west-3ubzlhskjv.auth.eu-west-3.amazoncognito.com',
  },

  // URL de redirection après connexion/déconnexion — doit être ajoutée dans
  // App client → Allowed callback URLs / Allowed sign-out URLs.
  redirectUri: 'https://site.id.finances-territoires.fr/admin/',
};
