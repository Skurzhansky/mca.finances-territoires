// Contenu des pages internes selon la maquette validée (site-bpce-ft.html),
// avec les relectures du document « Refonte » (Maria, Sabrina, Laurent).
// Chaque entrée produit les champs `heroEyebrow`, `heroColor`, `headline` et
// `blocks` d'une page ; la migration ne les ajoute que si la page n'a pas
// encore de blocs (on n'écrase jamais une page déjà retravaillée dans l'admin).
// Les textes restent modifiables bloc par bloc depuis l'admin.
//
// Les chiffres/témoignages non vérifiés sont signalés « [À COMPLÉTER …] ».

const cta = (title, text, primaryLabel, secondaryLabel = '', secondaryHref = '', primaryHref = 'contact/') =>
  ({ type: 'cta', title, text, primaryLabel, primaryHref, secondaryLabel, secondaryHref });

const steps = (eyebrow, title, items) => ({ type: 'steps', eyebrow, title, items });

const secteur = ({ enjeux, offers, exampleLabel = '', exampleText = '', exampleAmount = '', exampleCaption = '', gains, color }) => ({
  type: 'secteur', color,
  enjeuxTitle: 'Vos enjeux', enjeux: enjeux.join('\n'),
  offerTitle: 'Ce que nous proposons', offers: offers.map(([title, text]) => ({ title, text })),
  exampleLabel, exampleText, exampleAmount, exampleCaption,
  gainsTitle: 'Ce que vous y gagnez', gains: gains.join('\n'),
});

// Comparatif Note d'opportunité / Veille continue, en bas des deux pages
// (retours du 26/11) ; la Veille continue est la colonne mise en avant.
export const compareFormats = (page) => ({
  type: 'compare', color: 'violet',
  eyebrow: page === 'veille' ? "Format 2 — Note d'opportunité" : 'Deux formats complémentaires',
  title: "Note d'opportunité ou Veille continue ?",
  subtitle: page === 'veille'
    ? "Vous souhaitez d'abord vérifier si un projet est finançable avant de vous engager ? Commencez par une Note d'opportunité."
    : "Besoin d'un suivi dans la durée plutôt que d'une étude ponctuelle ? La Veille continue prend le relais.",
  titleA: "Note d'opportunité", itemsA: 'Analyse ponctuelle\nUn projet spécifique\nÉchéance court terme\nIdéal en amont\nSans engagement',
  buttonALabel: page === 'veille' ? "Découvrir la Note d'opportunité →" : "Demander une Note d'opportunité →",
  buttonAHref: page === 'veille' ? 'optimaides-subventions/' : 'contact/',
  titleB: 'Veille continue', itemsB: 'Accompagnement continu\nPPI & projets multiples\nAlertes régulières\nStratégie long terme\nRelation continue',
  buttonBLabel: page === 'veille' ? 'Lancer ma Veille continue →' : 'Découvrir la Veille continue →',
  buttonBHref: page === 'veille' ? 'contact/' : 'veille-personnalisee/',
  highlight: 'b', highlightLabel: 'Stratégie long terme',
});

// Page Formations : contenus du site actuel (finances-territoires.fr/nos-formations),
// mention Qualiopi obligatoire en introduction, offre 2027 (retours du 26/11).
// Chaque formation peut être masquée ; le bouton « Programme 2026 » se masque
// d'un réglage une fois l'année terminée.
const P2026 = 'docs/formations/2026/';
export const formationsBlocks = () => [
  { type: 'certif',
    eyebrow: 'Programmes de formation',
    title: 'Un organisme de formation certifié Qualiopi',
    subtitle: 'Collectivités locales – Établissements de santé – Habitat social – EPL – Entreprises',
    text: "BPCE Finances & Territoires est un acteur de référence dans le domaine des financements publics et privés (non bancaires). Forts de notre expérience terrain, nous mettons notre expertise au service des acteurs publics locaux et institutionnels pour soutenir leurs projets d'investissement et de développement.\n\nNotre organisme de formation est né de la volonté de partager notre savoir-faire et nos connaissances pratiques et théoriques. Nos formations sont élaborées et dispensées par des experts spécialisés dans l'analyse, le conseil et le montage dans tout type de financements (publics, privés, nationaux, européens) pour les projets d'investissement portés par des acteurs publics et privés non lucratifs.\n\nCes modules de formation sont dédiés aux professionnels impliqués dans le montage d'opération et la gestion financière, souhaitant renforcer et actualiser leurs connaissances. Nous proposons nos formations en format distanciel.",
    certText: 'BPCE Finances & Territoires est certifié Qualiopi par Pronéo Certification : [cliquez-ici pour afficher la certification](docs/formations/certificat-qualiopi.pdf)',
    logo: 'images/formations/logo-qualiopi.png',
    logoAlt: 'Qualiopi — processus certifié — République française',
    logoText: "La certification qualité a été délivrée au titre de la catégorie d'action suivante : **ACTIONS DE FORMATION**" },
  { type: 'courses', eyebrow: 'Programmes — Aides & Subventions', title: 'Secteur public et privé non lucratif',
    programYear: '2027', prevProgramYear: '2026', showPrevPrograms: 'oui', color: 'violet',
    items: [
      { title: 'Mobiliser les aides publiques nationales pour vos projets d’investissement', level: 'Initiation', days: '0,5 jour', teaser: 'Comment vous familiariser avec les aides et subventions nationales.', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: P2026 + 'programme-2026-as-initiation-secteur-public.pdf', hidden: 'non', color: 'violet' },
      { title: 'Mobiliser les aides européennes pour vos projets d’investissement', level: 'Initiation', days: '0,5 jour', teaser: 'Comment vous familiariser avec les fonds européens.', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: P2026 + 'programme-2026-as-initiation-secteur-public.pdf', hidden: 'non', color: 'magenta' },
      { title: 'Mobiliser les Aides & Subventions pour vos projets d’investissement', level: 'Perfectionnement', days: '1 jour', teaser: 'Comment monter en compétences sur les Aides & Subventions (aides nationales et européennes).', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: P2026 + 'programme-2026-as-perfectionnement-secteur-public.pdf', hidden: 'non', color: 'indigo' },
      { title: 'Fonds européens — niveau avancé', level: 'Avancé', days: '', teaser: 'Formation suspendue — masquée en attendant un éventuel retour.', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: '', hidden: 'oui', color: 'prune' },
      { title: 'Financements privés et fonds de dotation', level: '', days: '', teaser: 'Possibilité de formation en intra.', mode: 'Intra', contactLabel: 'Nous consulter', contactHref: 'contact/', programHref: '', prevProgramHref: '', hidden: 'non', color: 'turquoise' },
    ] },
  { type: 'courses', eyebrow: 'Nouveautés 2027', title: 'Secteur des entreprises',
    programYear: '2027', prevProgramYear: '2026', showPrevPrograms: 'oui', color: 'bleu',
    items: [
      { title: 'Comprendre et mobiliser les aides & subventions pour vos projets de croissance', level: 'Initiation', days: '0,5 jour', teaser: 'Comment vous familiariser avec les Aides & Subventions.', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: P2026 + 'programme-2026-entreprises-initiation.pdf', hidden: 'non', color: 'bleu' },
      { title: 'Structurer et sécuriser les aides & subventions pour vos projets de croissance', level: 'Perfectionnement', days: '0,5 jour', teaser: 'Comment monter en compétences sur les Aides & Subventions.', mode: 'Intra / Inter · Distanciel', programHref: '', prevProgramHref: P2026 + 'programme-2026-entreprises-perfectionnement.pdf', hidden: 'oui', color: 'indigo' },
    ] },
  { type: 'stats', eyebrow: 'Les chiffres clés', title: 'Nos formations en chiffres',
    footnote: '*Enquête de satisfaction à laquelle 82 stagiaires ont répondu.',
    items: [
      { value: '50', suffix: '', label: "Nombre d'apprenants formés", text: 'depuis 2024', color: 'violet' },
      { value: '4,2', suffix: '/5', label: 'Niveau de satisfaction de nos apprenants*', text: 'depuis 2024', color: 'turquoise' },
    ] },
  { type: 'quotes', eyebrow: 'Avis de nos stagiaires', title: 'Nos clients ont particulièrement apprécié',
    items: [
      'La pédagogie des formateurs',
      'La diversité des intervenants en fonction de leurs compétences',
      'Les informations très instructives, le partage de bonnes pratiques et le retour « terrain »',
      "L'accueil et la clarté de la formation",
      'Les intervenants expérimentés, rigoureux et clairs',
      'Les supports détaillés et pratiques',
      'La méthode pédagogique efficace entre présentations et cas pratiques',
      'Formation complète de très haut niveau, comme ses intervenants, à la fois experts et praticiens expérimentés. Supports détaillés et pratiques pour leur mise en application directe. Je recommande !',
      "La qualité d'écoute, les réponses claires, la maîtrise du temps de formation",
      "Le contenu complet et structuré, l'approche interactive, l'expertise des intervenants",
      'Les exercices, poser des questions libres, les clés pour bien monter son dossier',
      'Les échanges constructifs, les quiz en fin de période et le format à distance',
    ].join('\n') },
  { type: 'faq', eyebrow: 'Informations pratiques', title: 'Souhaitez-vous en savoir plus ?',
    items: [
      { title: 'Tarifs, modalités et délais d’accès', text: "Pour obtenir les informations sur les tarifs ainsi que sur les modalités et les délais d'accès à nos sessions de formation, nous vous invitons à renseigner le [formulaire de contact](contact/) en nous précisant l'intitulé et la date de la formation qui ont retenu votre intérêt." },
      { title: 'Formations Outre-mer', text: "Pour répondre aux attentes et aux besoins spécifiques des stagiaires ultramarins, nous proposons uniquement des formations en INTRA dédiées aux territoires d'Outre-mer. Délais d'inscription : nous consulter." },
      { title: 'Accessibilité aux personnes en situation de handicap (PSH)', text: "Si vous souhaitez nous faire part d'une éventuelle reconnaissance de handicap ou formuler une demande d'aménagements liée à un handicap, n'hésitez pas à nous l'indiquer à l'adresse [formation@finances-territoires.fr](mailto:formation@finances-territoires.fr) ou en prenant contact au 04 69 96 61 60 afin que nous puissions étudier ensemble la faisabilité de votre projet de formation." },
    ] },
  { type: 'cta', title: 'Formez vos équipes aux aides & subventions', text: "Précisez-nous l'intitulé et la date de la formation qui vous intéressent : nous revenons vers vous avec les tarifs et les modalités d'accès.", primaryLabel: 'Contactez-nous →', primaryHref: 'contact/', secondaryLabel: '', secondaryHref: '' },
];

export const EXPERTISE_BLOCKS = {
  'detections-des-opportunites': () => ({
    heroEyebrow: 'Expertises et Solutions', heroColor: 'violet',
    blocks: [
      { type: 'cards', eyebrow: 'Deux formats', title: 'Choisissez le format adapté à votre besoin', columns: '2', items: [
        { icon: 'activite', color: 'violet', title: 'Veille continue', text: 'Un accompagnement continu, nourri par votre PPI et vos projets, pour anticiper les opportunités et maximiser le potentiel de financement sur le long terme.', list: 'Cartographie des opportunités\nAlertes personnalisées\nPoints d\'étape réguliers', href: 'veille-personnalisee/', linkLabel: 'Découvrir la Veille continue →' },
        { icon: 'recherche', color: 'magenta', title: "Note d'opportunité", text: 'Vérifiez en amont si votre projet est potentiellement finançable à date — et identifiez les financeurs susceptibles de le soutenir.', list: 'Analyse ciblée sur un projet\nÉchéance court terme\nSans engagement', href: 'optimaides-subventions/', linkLabel: "Découvrir la Note d'opportunité →" },
      ] },
      cta('Un projet à financer ? Parlons-en.', 'Nos consultants vous orientent vers le format le plus adapté à votre situation.', 'Nous contacter →'),
    ],
  }),

  'veille-personnalisee': () => ({
    heroEyebrow: 'Détection des opportunités — Format 1', heroColor: 'violet', headline: 'Veille continue',
    blocks: [
      { type: 'intro',
        tags: 'Stratégie long terme\nAlertes personnalisées\nPPI & projets multiples',
        title: 'Construire une stratégie de financement dans la durée',
        text: "Le paysage des aides est vaste et en constante évolution : +19 000 mesures de soutien à date. Sans veille active et experte, la majorité de ces opportunités restent inexploitées. La Veille continue vous permet de ne jamais passer à côté d'une aide pertinente.\n\nNos consultants construisent avec vous une cartographie de vos projets et thématiques, puis veillent activement sur toutes les opportunités correspondantes — alertes, points réguliers et recommandations à la clé.",
        buttonLabel: 'Demander un diagnostic gratuit →', buttonHref: 'contact/',
        panels: [{ kind: 'offre', color: 'violet', tag: 'Accompagnement continu', title: 'Ce que vous obtenez',
          items: "Cartographie des opportunités correspondant à votre PPI et vos projets\nAlertes dès qu'un nouveau dispositif apparaît ou est mis à jour\nPoints d'étape réguliers pour ajuster le plan de financement\nConsultant dédié, à votre écoute pour faire émerger les opportunités\nDétection des AAP de fondations (~1 500 sources privées)",
          linkLabel: 'Nous contacter →', linkHref: 'contact/' }] },
      steps('Notre méthode', 'Comment fonctionne la Veille continue', [
        { tag: 'Cadrage', title: 'Analyse de votre contexte et de vos projets', text: 'Nous prenons le temps de comprendre votre structure, votre PPI, vos projets prioritaires et votre territoire, afin de définir précisément le périmètre de la veille.' },
        { tag: 'Veille active', title: 'Identification continue des aides mobilisables', text: "Via FinBoost, nous croisons votre périmètre avec l'ensemble des dispositifs disponibles : fonds européens, aides nationales, aides régionales, aides départementales, aides locales, AAP privés et fondations." },
        { tag: 'Alertes', title: "Notification dès qu'une opportunité émerge", text: "Vous êtes alerté en temps réel dès qu'un nouveau dispositif correspondant à vos projets s'ouvre, ou qu'un calendrier de dépôt approche." },
        { tag: 'Pilotage', title: 'Points réguliers et ajustements', text: "Des réunions de suivi régulières pour affiner la stratégie, prioriser les opportunités et décider ensemble des suites à donner (montage, note d'opportunité, etc.)." },
      ]),
      cta('Prêt à lancer votre Veille continue ?', 'Nos consultants analysent votre PPI et vos projets pour construire une stratégie de financement proactive et durable.', 'Nous contacter →', "Tester d'abord avec une Note d'opportunité →", 'optimaides-subventions/'),
      compareFormats('veille'),
    ],
  }),

  'optimaides-subventions': () => ({
    heroEyebrow: 'Détection des opportunités — Format 2', heroColor: 'violet', headline: "Note d'opportunité",
    blocks: [
      { type: 'intro',
        tags: 'Analyse ciblée\nSans engagement\nÉchéance court terme',
        title: "Tester le potentiel d'un projet avant de s'engager",
        text: "La Note d'opportunité répond à une question décisive : **« Mon projet est-il finançable à date ? »**\n\nC'est une analyse ciblée sur un projet ou une thématique spécifique, sur une échéance courte. Elle vous permet de prendre une décision éclairée avant de vous engager dans une démarche plus longue — Veille continue ou montage de dossier.",
        buttonLabel: "Demander une Note d'opportunité →", buttonHref: 'contact/',
        panels: [
          { kind: 'liste', title: "📌 Quand choisir la Note d'opportunité ?", items: "Vous avez un projet précis mais n'êtes pas sûr qu'il soit éligible à des aides\nVous souhaitez tester le potentiel avant d'investir du temps en montage de dossier\nVous avez besoin d'une réponse rapide pour argumenter un plan de financement en interne\nVous hésitez à vous engager dans une Veille continue sans connaître le potentiel" },
        ] },
      steps('Notre méthode', "Comment se déroule une Note d'opportunité ?", [
        { tag: 'Échange initial', title: 'Vous nous présentez votre projet', text: 'Un échange rapide (téléphonique ou visio) pour comprendre la nature du projet, votre calendrier, votre statut et vos premières questions.' },
        { tag: 'Analyse', title: 'Recherche ciblée via FinBoost', text: "Nos consultants interrogent l'ensemble des dispositifs disponibles à date. Ils analysent l'éligibilité et identifient les financeurs les plus pertinents." },
        { tag: 'Livrable', title: "Remise de la Note d'opportunité", text: 'Vous recevez une note structurée : liste des financements mobilisables, niveaux de priorité, estimation des montants et recommandations pour la suite.' },
        { tag: 'Suite', title: 'Décision éclairée pour la suite', text: 'Fort de cette analyse, vous choisissez en toute connaissance de cause : montage de dossier, Veille continue, ou les deux.' },
      ]),
      cta('Votre projet est-il finançable à date ?', "Nos experts analysent votre projet et vous remettent une Note d'opportunité exploitable immédiatement.", "Demander une Note d'opportunité →", 'Découvrir la Veille continue →', 'veille-personnalisee/'),
      compareFormats('note'),
    ],
  }),

  'mobilisation-des-aides': () => ({
    heroEyebrow: 'Expertises et Solutions', heroColor: 'magenta',
    blocks: [
      { type: 'cards', eyebrow: 'Mobilisation des aides', title: "De l'identification au versement final", columns: '2', items: [
        { icon: 'crayon', color: 'magenta', title: 'Montage des dossiers', text: "Constitution et dépôt des dossiers d'aides françaises et européennes, par un consultant expérimenté, pour maximiser vos chances d'obtention.", list: "Analyse de l'éligibilité\nRédaction et constitution des dossiers\nDépôt et suivi de l'instruction", href: 'montage-des-dossiers/', linkLabel: 'Découvrir le montage →' },
        { icon: 'graphique', color: 'turquoise', title: 'Gestion des aides obtenues', text: "Pilotage des demandes de paiement et accompagnement jusqu'au versement final et au bilan d'exécution.", list: 'Pilotage des demandes de paiement\nBilan d\'exécution & conformité\nSécurisation des fonds européens', href: 'gestion-des-aides/', linkLabel: 'Découvrir la gestion des aides →' },
      ] },
      cta('Un projet à financer ? Parlons-en.', "Nos experts évaluent l'éligibilité de votre projet et vous proposent un plan d'action concret.", 'Nous contacter →'),
    ],
  }),

  'montage-des-dossiers': (p) => ({
    heroEyebrow: 'Mobilisation des aides', heroColor: 'magenta', headline: 'Montage des dossiers',
    blocks: [
      { type: 'intro',
        tags: "Montage de dossiers\nGestion des aides\nAides européennes\nSuivi jusqu'au versement",
        title: 'Le montage, un métier à part entière',
        text: "Obtenir une subvention ne s'improvise pas. La qualité du dossier, la rigueur des justificatifs, la connaissance des critères d'instruction et le respect des délais sont déterminants pour le succès d'une demande d'aide.\n\nNos équipes, spécialisées par secteur, prennent en charge l'intégralité du processus : de l'analyse de l'éligibilité à la gestion post-attribution, en passant par la rédaction et le dépôt des dossiers, par un consultant expérimenté.",
        buttonLabel: 'Nous confier mon dossier →', buttonHref: 'contact/',
        panels: [
          { kind: 'offre', color: 'magenta', tag: 'Mobilisation', title: 'Montage des dossiers',
            items: "Analyse de l'éligibilité de votre projet aux dispositifs ciblés\nRédaction du mémoire technique et du budget prévisionnel\nRecensement et coordination des pièces administratives\nDépôt des dossiers dans les délais impartis, suivi de l'instruction" },
          { kind: 'offre', color: 'turquoise', tag: 'Post-attribution', title: 'Gestion des aides & sécurisation européenne',
            items: "Suivi des obligations contractuelles liées aux aides obtenues\nPilotage des demandes de versements intermédiaires et finaux\nSécurisation spécifique des fonds européens (FEDER, FSE+, FEADER)\nGestion des audits et contrôles des organismes financeurs",
            linkLabel: 'Gestion des aides obtenues →', linkHref: 'gestion-des-aides/' },
        ] },
      { type: 'cards', eyebrow: 'Notre processus', title: "De l'analyse à l'obtention", columns: '4', color: 'magenta', items: [
        { icon: 'recherche', title: "1. Analyse d'éligibilité", text: 'Vérification de la conformité de votre projet avec les critères de chaque dispositif pour ne cibler que les aides réellement accessibles.' },
        { icon: 'crayon', title: '2. Rédaction & constitution', text: 'Rédaction des mémoires techniques, coordination des pièces administratives et financières, préparation du budget prévisionnel.' },
        { icon: 'activite', title: '3. Dépôt & instruction', text: 'Dépôt dans les délais, lien avec les instructeurs, traitement des demandes de pièces complémentaires, validation des conventions attributives.' },
        { icon: 'valide', title: '4. Obtention sécurisée', text: "Principalement rémunéré au succès. Nous suivons chaque dossier jusqu'à l'obtention officielle de l'aide et la signature de la convention." },
      ] },
      { type: 'testimonial',
        quote: p.testimonial?.quote || '[À COMPLÉTER — témoignage client réel à ajouter ici]',
        name: p.testimonial?.cite || '[Nom, fonction — à compléter]', role: '' },
      { type: 'faq', eyebrow: 'Questions fréquentes', title: 'Vos questions sur le montage', items: [
        ...((p.faq || []).filter(x => x.title || x.text)),
        { title: 'Combien de temps prend un montage de dossier ?', text: 'Cela dépend du dispositif. Un dossier DETR peut être constitué en 2 à 4 semaines. Un dossier européen FEDER peut nécessiter 2 à 4 mois. Nous vous informons dès le départ des délais à prévoir.' },
        { title: "Qu'est-ce que la sécurisation des aides européennes ?", text: "Les fonds européens font l'objet de contrôles rigoureux pouvant aller jusqu'à 5 ans après le versement. Notre mission consiste à mettre en place les procédures, documenter les dépenses et préparer votre structure à d'éventuels contrôles." },
      ] },
      cta('Un projet à financer ? Parlons-en.', "Nos experts évaluent l'éligibilité de votre projet et vous proposent un plan d'action concret.", 'Nous contacter →', 'Pilotage des aides obtenues →', 'gestion-des-aides/'),
    ],
  }),

  'gestion-des-aides': () => ({
    heroEyebrow: 'Pilotage des aides', heroColor: 'turquoise', headline: 'Gestion des aides obtenues',
    blocks: [
      { type: 'cards', columns: '2', color: 'turquoise', items: [
        { icon: 'tableau', title: 'Pilotage des demandes de paiement', text: 'Suivi des échéances de paiement, des montants obtenus et à percevoir. Coordination des demandes de versement auprès des organismes financeurs.' },
        { icon: 'document', title: "Bilan d'exécution & conformité", text: "Assistance à la liquidation des dossiers, accompagnement au bilan d'exécution, justification des dépenses et anticipation des contrôles des financeurs." },
        { icon: 'alerte', title: 'Alertes personnalisées', text: "Notification en temps réel sur les échéances, les risques de perte d'aide et les obligations déclaratives — via notre outil FinBoost." },
        { icon: 'bouclier', title: 'Sécurisation des fonds européens', text: 'Accompagnement spécifique pour les fonds FEDER, FSE+ et FEADER — suivi renforcé jusqu\'aux contrôles et certification finale des dépenses.' },
      ] },
      { type: 'intro', eyebrow: 'Notre outil', title: 'Un tableau de bord dédié à vos aides',
        text: "Un tableau de bord dédié pour suivre en temps réel l'état de vos dossiers, vos échéances et les montants à percevoir, projet par projet.",
        buttonLabel: 'Nous contacter →', buttonHref: 'contact/',
        panels: [{ kind: 'liste', title: 'Avec FinBoost, vous suivez', items: "L'état d'avancement de chaque dossier\nLes échéances de justification et de versement\nLes montants obtenus et restant à percevoir\nLes alertes sur les risques de perte d'aide" }] },
      cta("Sécurisez chaque versement jusqu'au bout", 'Nos experts prennent en charge le pilotage de vos aides obtenues pour garantir le versement intégral.', 'Nous contacter →', 'Montage des dossiers →', 'montage-des-dossiers/'),
    ],
  }),

  'fonds-prives-mecenat': () => ({
    heroEyebrow: 'Expertises et Solutions', heroColor: 'turquoise', headline: 'Fonds privés / Mécénat',
    blocks: [
      { type: 'cards', eyebrow: 'Nos offres', title: 'Trois leviers pour développer vos ressources privées', subtitle: "Nous connectons les projets porteurs d'intérêt général — collectivités, structures publiques, structures du médico-social ou associations — aux mécènes du territoire, principalement des PME et ETI.", columns: '3', color: 'turquoise', style: 'numero', items: [
        { title: 'Fonds de dotation & collecte de fonds privés', text: 'Création ou relance de votre fonds de dotation et activation de votre stratégie de mécénat.', href: 'fonds-de-dotation-mecenat-local/' },
        { title: 'Recherche de mécènes', text: 'Identification et sollicitation des entreprises du territoire susceptibles de soutenir votre projet.', href: 'fundraising/' },
        { title: 'AAP de fondations', text: 'Repérage des appels à projets des fondations privées et accompagnement dans leur sollicitation.', href: 'recherche-de-fondations/' },
      ] },
      cta('Développons vos ressources privées ensemble', 'Diagnostic gratuit de votre potentiel de mécénat et de collecte.', 'Demander un diagnostic →', 'Nos formations →', 'nos-formations/'),
    ],
  }),

  'fonds-de-dotation-mecenat-local': () => ({
    heroEyebrow: 'Fonds privés / Mécénat', heroColor: 'turquoise', headline: 'Fonds de dotation & collecte de fonds privés',
    blocks: [
      { type: 'cards', columns: '2', color: 'turquoise', style: 'numero', items: [
        { title: 'Créer votre fonds de dotation', list: "Interviews préliminaires pour définir le positionnement\nRédaction des statuts et structuration de la gouvernance\nDémarches administratives : dossier préfecture, JOAFE, SIREN\nMise en conformité réglementaire et appel public à la générosité\nAccompagnement juridique des premiers CA" },
        { title: 'Activer votre stratégie de mécénat', list: "Brochure mécénat et supports de présentation projets\nConvention de mécénat, charte éthique, reçus fiscaux\nCatalogue des contreparties et segmentation des mécènes\nPlan stratégique de collecte et permanence de conseil\nConsultant expert dédié pendant toute la durée" },
      ] },
      { type: 'stats', items: [
        { value: 'Avant', label: 'le lancement', text: 'Positionnement, statuts, gouvernance', color: 'turquoise' },
        { value: 'Pendant', label: 'la campagne', text: 'Stratégie, supports et prospection', color: 'violet' },
        { value: '18', suffix: ' mois', label: 'en moyenne', text: "D'accompagnement, jusqu'après le lancement de la collecte", color: 'magenta' },
      ] },
      cta('Développons vos ressources privées ensemble', 'Diagnostic gratuit de votre potentiel de mécénat et de collecte.', 'Demander un diagnostic →', 'Recherche de mécènes →', 'fundraising/'),
    ],
  }),

  'fundraising': () => ({
    heroEyebrow: 'Fonds privés / Mécénat', heroColor: 'turquoise', headline: 'Recherche de mécènes',
    blocks: [
      { type: 'intro', title: 'Mobiliser les entreprises de votre territoire',
        text: "Nous connectons les projets porteurs d'intérêt général aux mécènes du territoire, principalement des PME et ETI, et vous accompagnons de la construction du discours de collecte jusqu'à la sécurisation des dons.",
        buttonLabel: 'Nous contacter →', buttonHref: 'contact/',
        panels: [{ kind: 'offre', color: 'turquoise', tag: 'Fonds privés', title: 'Recherche de mécènes',
          items: "Construction d'un discours de collecte (case for support)\nCiblage et identification des potentiels de collecte\nÉquipe dédiée à la prospection et prise de RDV\nSécurisation des dons et conventions de mécénat\nReporting détaillé tout au long de la mission" }] },
      cta('Développons vos ressources privées ensemble', 'Diagnostic gratuit de votre potentiel de mécénat et de collecte.', 'Demander un diagnostic →', 'AAP de fondations →', 'recherche-de-fondations/'),
    ],
  }),

  'recherche-de-fondations': () => ({
    heroEyebrow: 'Fonds privés / Mécénat', heroColor: 'turquoise', headline: 'AAP de fondations',
    blocks: [
      { type: 'intro', title: "Répondre aux appels à projets des fondations",
        text: 'Nous identifions les fondations privées et fonds de dotation susceptibles de soutenir votre projet, et vous accompagnons dans la structuration de vos projets pour optimiser vos démarches.',
        buttonLabel: 'Nous contacter →', buttonHref: 'contact/',
        panels: [{ kind: 'offre', color: 'turquoise', tag: 'Fonds privés', title: 'Appels à projets de fondations',
          statValue: '~1 500', statLabel: 'sources de financements privés via FinBoost',
          items: "Recherche ciblée d'AAP de fondations et fonds de dotation\nAlertes par projet sur les nouvelles ouvertures\nAppui à la structuration des projets pour optimiser les démarches" }] },
      cta('Développons vos ressources privées ensemble', 'Diagnostic gratuit de votre potentiel de mécénat et de collecte.', 'Demander un diagnostic →', 'Fonds de dotation →', 'fonds-de-dotation-mecenat-local/'),
    ],
  }),

  'nos-formations': () => ({
    heroEyebrow: 'Expertises et Solutions', heroColor: 'violet',
    blocks: formationsBlocks(),
  }),
};

export const SECTEUR_BLOCKS = {
  'collectivites-epci': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'violet', headline: 'Collectivités Territoriales & EPCI',
    blocks: [
      secteur({ color: 'violet',
        enjeux: ['Accéder à des financements diversifiés pour des besoins multiples', 'Gagner en lisibilité dans le pilotage des dossiers', 'Structurer une stratégie financière durable sur le long terme', 'Naviguer entre guichets multiples, règles d\'éligibilité complexes et calendriers contraints'],
        offers: [['Détection proactive', 'Veille sur DSIL, DETR, Fonds Vert, FNADT, programmes européens, AAP thématiques'], ['Montage & instruction', 'Dossiers solides, adaptés aux attentes des financeurs'], ['Gestion des subventions', "Suivi jusqu'au versement final"], ['Formation des équipes', "Veille, mécanismes d'aides, structuration de projets"]],
        exampleLabel: 'Exemple concret — Commune du Rhône', exampleText: 'Une commune accompagnée pour sécuriser le financement de la reconstruction de son pôle nautique. Mission complète : détection, montage, instruction et suivi.', exampleAmount: '800 000 €', exampleCaption: "mobilisés auprès du Secrétariat d'État chargé de la Mer",
        gains: ['Des financements mobilisés à temps et sécurisés', "Une meilleure lisibilité dans l'offre d'aides disponibles", 'Une méthodologie éprouvée et transférable en interne'] }),
      cta('Vous souhaitez optimiser vos financements ?', 'Contactez-nous pour bâtir une stratégie adaptée à vos projets.', 'Nous contacter →', 'Nos expertises →', 'detections-des-opportunites/'),
    ],
  }),
  'etablissements-de-sante-publics-non-lucratifs': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'turquoise', headline: 'Établissements de Santé Publics & Non Lucratifs',
    blocks: [
      secteur({ color: 'turquoise',
        enjeux: ['Accéder aux dispositifs spécifiques du secteur médico-hospitalier', 'Monter des dossiers solides en lien avec les priorités régionales de santé', "Valoriser l'impact territorial et social de vos projets"],
        offers: [['Repérage ciblé des dispositifs santé', 'AAP ARS, prévention, innovation technologique, fonds européens'], ['Structuration de projets complexes', 'budgétaire, réglementaire et opérationnel'], ['Soutien à la justification', "Suivi administratif jusqu'au versement final"]],
        exampleLabel: 'Exemple concret', exampleText: 'Centre hospitalier régional accompagné dans la détection et le montage de dossiers pour le renouvellement de son plateau technique.', exampleAmount: '4,5 M€', exampleCaption: "d'aides obtenues pour les équipements médicaux de pointe",
        gains: ["Un gain de temps et de clarté dans la recherche d'aides", 'Des dossiers mieux positionnés et plus convaincants', 'Une sécurisation du montage au suivi'] }),
      cta('Vous portez un projet de santé à fort impact ?', 'Contactez-nous pour en parler avec nos consultants.', 'Nous contacter →'),
    ],
  }),
  'structures-medico-sociales': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'prune', headline: 'Structures Médico-Sociales',
    blocks: [
      secteur({ color: 'prune',
        enjeux: ['Répondre aux AAP spécifiques (ARS, CNSA, fondations privées)', 'Valoriser la plus-value sociale de vos actions', "Sécuriser l'instruction, le suivi et la justification des aides"],
        offers: [['Identification des aides', 'AAP ARS, CNSA, fondations thématiques autonomie/inclusion, mécénat'], ['Montage rigoureux', 'Valorisation impact social, cadre réglementaire et budgétaire'], ['Gestion et justification', 'Suivi administratif, anticipation des contrôles, versements']],
        exampleLabel: 'Exemple concret — Aisne', exampleText: "Association médico-sociale accompagnée dans la structuration d'un complexe inclusif : espace de restauration et gîtes hôteliers, favorisant inclusion et développement local.", exampleAmount: '250 000 €', exampleCaption: "obtenus auprès de l'État via le FNADT",
        gains: ['Une vision claire des aides mobilisables', 'Une gestion fluide et sécurisée de vos financements', 'Une montée en compétence durable de vos équipes'] }),
      cta("Besoin d'un accompagnement sur mesure ?", 'Contactez-nous pour en parler avec nos consultants.', 'Nous contacter →'),
    ],
  }),
  'entreprises-publiques-locales-epl': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'indigo', headline: 'Entreprises Publiques Locales (EPL)',
    blocks: [
      secteur({ color: 'indigo',
        enjeux: ['Identifier les dispositifs adaptés à vos activités hybrides (intérêt général + logique économique)', 'Structurer des montages en lien avec vos collectivités actionnaires', 'Développer des ressources complémentaires pour sécuriser vos investissements'],
        offers: [['Stratégie multi-niveaux', 'Articulation des financements publics locaux, nationaux et européens'], ['Montages complexes partagés', 'Co-construction avec vos collectivités actionnaires'], ['Financements complémentaires', 'Fonds de dotation, mécénat, AAP thématiques']],
        gains: ['Une stratégie adaptée à votre gouvernance mixte', 'Une meilleure sécurisation de vos ressources', 'Une reconnaissance accrue auprès des financeurs'] }),
      cta('Besoin de structurer votre financement ?', 'Contactez-nous pour en parler avec nos consultants.', 'Nous contacter →'),
    ],
  }),
  'logement-social': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'violet', headline: "Bailleurs sociaux — Associations & Acteurs de l'habitat",
    blocks: [
      secteur({ color: 'magenta',
        enjeux: ['Combiner des aides variées dans un paysage financier morcelé', 'Répondre aux priorités nationales (transition énergétique, mixité sociale)', 'Mettre en valeur la portée sociale, environnementale et territoriale de vos actions'],
        offers: [['Veille & détection', "ANRU, Plan Logement d'Abord, Fonds Vert, FEDER, FSE+, fondations"], ['Montages hybrides', 'Aides publiques, financements bancaires, mécénat, participation citoyenne'], ['Justification & versements', 'Suivi des dépenses, justificatifs et contrôles, y compris pluriannuels']],
        exampleLabel: 'Exemple concret — Bouches-du-Rhône', exampleText: "Bailleur social accompagné pour financer un ambitieux projet de renaturation d'une résidence. Montage hybride alliant subventions publiques et fonds environnementaux.", exampleAmount: '70 %', exampleCaption: 'du projet financé — reste à charge réduit à seulement 30 %',
        gains: ['Une stratégie de financement complète et structurée', "Un accompagnement de la détection au versement final", "Une mise en valeur de l'impact social et territorial"] }),
      cta("Vous portez un projet ambitieux pour l'habitat ?", 'Contactez-nous pour en parler avec nos consultants.', 'Nous contacter →'),
    ],
  }),
  'sdis-service-de-secours': () => ({
    heroEyebrow: 'Profil de nos clients', heroColor: 'rouge', headline: 'SDIS & Services de secours',
    blocks: [
      secteur({ color: 'rouge',
        enjeux: ["Identifier les dispositifs spécifiques à la sécurité civile et à l'innovation opérationnelle", 'Monter des projets complexes à fort impact en assurant conformité financière', 'Structurer des financements hybrides : aides publiques, mécénat et partenariats privés'],
        offers: [['Cartographie des aides', 'Fonds Vert, DSIL, DETR, France Relance, AAP résilience et prévention'], ['Montage stratégique', "Dossiers robustes avec justification de l'intérêt général et de l'impact territorial"], ['Plans hybrides', 'Subventions, mécénat de compétence, partenariats industriels']],
        gains: ['Une trajectoire de financement claire et sécurisée', 'La valorisation de projets à fort impact sociétal', 'Une expertise opérationnelle adaptée à votre mission'] }),
      cta('Vous avez un projet stratégique à sécuriser ?', 'Contactez-nous pour en parler avec nos consultants.', 'Nous contacter →'),
    ],
  }),
};

// Pages de base (data/pages.json → pages.<slug>).
export const PAGE_BLOCKS = {
  'finances-et-territoires': () => ({
    heroEyebrow: 'Filiale du Groupe BPCE', heroColor: 'violet', headline: 'BPCE Finances & Territoires',
    blocks: [
      { type: 'story', eyebrow: 'Notre histoire', title: 'Depuis sa création, une mission claire',
        text: "L'histoire de BPCE Finances & Territoires prend racine dans l'expérience de terrain. Pendant plus de dix ans, ses fondateurs ont accompagné des entreprises puis des collectivités, associations, établissements publics, bailleurs sociaux et structures médico-sociales dans le financement de leurs projets.\n\nAu fil des missions, un constat s'est imposé : pour nombre d'acteurs, la recherche de financements constitue un frein majeur — faute de moyens humains, de temps ou de compétences, mais aussi face à un paysage d'aides particulièrement vaste et épars, difficile à appréhender sans expertise dédiée.\n\nC'est pour répondre à ce besoin que **BPCE Finances & Territoires** voit le jour, basée à Bassens (Savoie), avec une ambition forte : allier expertise technique, ancrage terrain et accompagnement sur mesure.",
        quote: "« L'accès au financement ne doit pas être réservé aux initiés. Un bon projet ne peut réussir sans une ingénierie et un pilotage adapté. »",
        figuresLabel: 'BPCE Finances & Territoires en chiffres',
        figures: [{ value: '13 ans', label: "D'expertise territoriale" }, { value: '18 600', label: 'Dispositifs référencés' }, { value: '1,2 Md€', label: "D'aides mobilisées" }, { value: '100 %', label: 'National + DROM-COM' }],
        convictionsTitle: 'Nos convictions fondatrices',
        convictions: "L'accès au financement ne doit pas être réservé aux initiés des rouages administratifs\nUn bon projet ne peut réussir sans une ingénierie et un pilotage adapté\nLa rigueur, la pédagogie et la relation de confiance sont les piliers d'un accompagnement durable" },
      { type: 'cards', eyebrow: 'Nos compétences', title: 'Une équipe pluridisciplinaire au service de vos projets', subtitle: 'Anciens agents de la fonction publique, anciens instructeurs régionaux, experts en financements européens, en philanthropie, en développement durable ou en santé — nos profils sont complémentaires, notre approche est intégrée.', columns: '3', items: [
        { icon: 'activite', color: 'violet', title: 'Chaîne de valeur complète', text: "De la détection des opportunités à la mobilisation des aides, jusqu'au suivi administratif et financier. Nous maîtrisons l'ensemble du cycle de vie du financement." },
        { icon: 'recherche', color: 'magenta', title: 'Connaissance fine des dispositifs', text: 'Aux échelles locales, nationales et européennes, couplée à une veille réglementaire permanente. Nous intervenons dans des contextes variés et évolutifs.' },
        { icon: 'equipe', color: 'turquoise', title: 'Exigence, pédagogie et adaptabilité', text: 'Une approche transversale, proactive et humaine de la recherche de financements, adaptée aux réalités de terrain de chaque structure.' },
      ] },
      { type: 'values', eyebrow: 'Nos valeurs', title: 'Des valeurs qui guident chacune de nos actions', items: [
        { emoji: '🎯', color: 'violet', title: 'Utilité', subtitle: 'Solutions concrètes et efficaces', text: 'Nous intervenons là où notre accompagnement peut réellement faire la différence, en apportant des solutions adaptées aux enjeux de nos clients.' },
        { emoji: '🔬', color: 'magenta', title: 'Rigueur', subtitle: 'Expertise pointue et méthode', text: 'Face à la complexité des dispositifs et à l\'exigence des financeurs, nous cultivons une expertise pointue, un travail méthodique et une éthique professionnelle.' },
        { emoji: '🤝', color: 'turquoise', title: 'Confiance', subtitle: 'Écoute, transparence, co-construction', text: "Nous construisons des relations durables fondées sur l'écoute et la transparence. Loyauté, pédagogie et sens du service — à chaque étape." },
      ] },
      { type: 'team', eyebrow: 'Notre équipe', title: 'Des profils complémentaires, une approche intégrée', items: [
        { icon: 'recherche', color: 'violet', role: 'Équipe Veille', title: 'Cellule Veille & Intelligence financière', text: 'Chaque jour, notre cellule explore et analyse les dispositifs de financement à l\'échelle locale, nationale et européenne pour identifier les opportunités pertinentes.' },
        { icon: 'personne', color: 'magenta', role: 'Équipe Conseil', title: 'Consultants en ingénierie financière', text: "Nos consultants spécialisés assurent un accompagnement sur mesure à chaque étape, de la détection d'opportunités à la gestion des aides obtenues." },
        { icon: 'equipe', color: 'turquoise', role: 'Équipe Commerciale', title: 'Relation client & développement', text: "Point d'entrée privilégié, notre équipe vous accompagne dans l'analyse de vos besoins et l'orientation vers les solutions les plus pertinentes." },
        { icon: 'bouclier', color: 'indigo', role: 'Équipe Support & Direction', title: 'Direction stratégique & qualité', text: "Notre direction supervise l'ensemble des activités et garantit la cohérence, la qualité et l'éthique de nos interventions. Elle impulse les évolutions nécessaires." },
      ] },
      cta('Rejoignez nos clients engagés', 'Échanges gratuits et sans engagement. Nos experts analysent votre situation.', 'Nous contacter →', 'Nos réussites →', 'les-reussites-de-nos-clients/'),
    ],
  }),

  'secteurs-dactivite': () => ({
    title: 'Profil de nos clients',
    heroEyebrow: 'BPCE Finances & Territoires', heroColor: 'violet',
    blocks: [
      { type: 'cards', style: 'secteur', columns: '3', items: [
        { icon: 'batiment', color: 'violet', title: 'Collectivité & EPCI', text: 'Communes, intercommunalités, départements, régions — DSIL, DETR, Fonds Vert, FNADT, programmes européens.', href: 'collectivites-epci/' },
        { icon: 'sante', color: 'turquoise', title: 'Santé (non lucratif)', text: 'Hôpitaux publics, cliniques associatives — AAP ARS, dispositifs liés à la qualité des soins, innovation technologique.', href: 'etablissements-de-sante-publics-non-lucratifs/' },
        { icon: 'equipe', color: 'prune', title: 'Médico-Social & Social', text: "EHPAD, IME, ESAT, CHRS — AAP ARS, CNSA, fondations privées, financements à l'investissement médico-social.", href: 'structures-medico-sociales/' },
        { icon: 'tableau', color: 'indigo', title: 'Entreprise Publique Locale (EPL)', text: 'SPL, SEM, SCIC — stratégie multi-niveaux adaptée à votre gouvernance hybride, articulant aides publiques et ressources complémentaires.', href: 'entreprises-publiques-locales-epl/' },
        { icon: 'logement', color: 'magenta', title: 'Bailleurs sociaux', text: "Bailleurs, OPH, associations d'habitat — ANRU, Fonds Vert, FEDER, dispositifs régionaux pour réhabilitation et mixité sociale.", href: 'logement-social/' },
        { icon: 'secours', color: 'rouge', title: 'SDIS & Services de secours', text: "Services d'incendie et de secours — Fonds Vert, DSIL, DETR, plans régionaux, résilience territoriale.", href: 'sdis-service-de-secours/' },
        { icon: 'entreprise', color: 'bleu', title: 'Entreprise privée', text: 'PME, ETI — financement de projets à impact, démarches RSE territorialisées, mécénat de compétence et aménagement.', href: 'entreprise/' },
      ] },
      cta('Votre secteur, notre expertise', 'Échanges gratuits et sans engagement pour identifier les pistes de financement les plus pertinentes.', 'Nous contacter →'),
    ],
  }),

  // La page Entreprise garde ses textes existants (enjeux, offres, gains),
  // présentés comme les autres profils clients.
  'entreprise': (c) => {
    const sections = c.sections || [];
    const list = (i) => (sections.filter(s => s.type === 'list')[i]?.items) || [];
    const offers = (sections.find(s => s.type === 'blocks')?.blocks || []).map(b => [b.title, b.text]);
    offers.push(['Immobilier & Aménagement', 'FEDER, FSE+, France Relance, ANRU, ADEME, Fonds Vert — nous identifions les aides compatibles avec vos opérations de construction, rénovation ou innovation urbaine.']);
    const cc = c.cta || {};
    return {
      heroEyebrow: 'Profil de nos clients', heroColor: 'bleu', headline: c.headline || 'Entreprise privée & Immobilier',
      blocks: [
        secteur({ color: 'bleu', enjeux: list(0), offers, gains: list(1) }),
        cta(cc.title || 'Vous développez un projet à fort impact ?', cc.text || '', (cc.label || 'Contactez-nous →')),
      ],
    };
  },
};
