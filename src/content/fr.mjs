/**
 * French content — the default locale, served at the site root.
 *
 * Every string a visitor can read lives in a content file like this one.
 * The templates contain no copy, so you can rewrite the entire site's wording
 * without touching a single line of markup.
 *
 * Keys here must stay in sync with ar.mjs and en.mjs. `npm run build` fails
 * loudly if a locale is missing a key the templates ask for.
 */

export default {
  // ───────────────────────────────────────────────────────────────────────────
  // Route slugs for this locale.
  // Localised URLs rank better than one set of English paths: a French speaker
  // searching "cours de musculation" is more likely to click /fr/cours/ than
  // /fr/classes/. Keep these stable once you launch — changing a slug changes
  // the URL, and old links 404 unless you add a redirect in vercel.json.
  // ───────────────────────────────────────────────────────────────────────────
  routes: {
    home: '',
    clubs: 'clubs',
    disciplines: 'cours',
    pricing: 'tarifs',
    coach: 'coach',
    gallery: 'galerie',
    contact: 'contact',
    blog: 'blog',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Interface chrome
  // ───────────────────────────────────────────────────────────────────────────
  ui: {
    skipToContent: 'Aller au contenu principal',
    menu: 'Menu',
    close: 'Fermer',
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    language: 'Langue',
    changeLanguage: 'Changer de langue',
    callNow: 'Appeler',
    whatsapp: 'WhatsApp',
    joinNow: 'S’inscrire',
    freeTrial: 'Séance d’essai gratuite',
    learnMore: 'En savoir plus',
    seeAll: 'Tout voir',
    seeClub: 'Voir le club',
    seePricing: 'Voir les tarifs',
    getDirections: 'Itinéraire',
    openingHours: 'Horaires',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'E-mail',
    closed: 'Fermé',
    today: 'Aujourd’hui',
    openNow: 'Ouvert maintenant',
    closedNow: 'Fermé actuellement',
    from: 'À partir de',
    perSession: '/ séance',
    perMonth: '/ mois',
    perQuarter: '/ 3 mois',
    perYear: '/ an',
    onRequest: 'Sur demande',
    mostPopular: 'Le plus choisi',
    scrollToExplore: 'Faites défiler',
    backToTop: 'Haut de page',
    readArticle: 'Lire l’article',
    published: 'Publié le',
    updated: 'Mis à jour le',
    readingTime: 'min de lecture',
    byAuthor: 'Par',
    breadcrumbHome: 'Accueil',
    relatedArticles: 'À lire aussi',
    allRightsReserved: 'Tous droits réservés',
    legalNotice: 'Mentions légales',
    sitemapLabel: 'Plan du site',
    followUs: 'Suivez-nous',
    quickLinks: 'Navigation',
    ourClubs: 'Nos clubs',
    newsletterTitle: 'Conseils d’entraînement, une fois par mois',
    newsletterNote: 'Pas de spam. Désinscription en un clic.',
    emailPlaceholder: 'votre@email.com',
    subscribe: 'Je m’abonne',
    days: {
      Mo: 'Lundi', Tu: 'Mardi', We: 'Mercredi', Th: 'Jeudi',
      Fr: 'Vendredi', Sa: 'Samedi', Su: 'Dimanche',
    },
    daysShort: { Mo: 'Lun', Tu: 'Mar', We: 'Mer', Th: 'Jeu', Fr: 'Ven', Sa: 'Sam', Su: 'Dim' },
  },

  nav: {
    home: 'Accueil',
    clubs: 'Nos clubs',
    disciplines: 'Cours',
    pricing: 'Tarifs',
    coach: 'Le coach',
    gallery: 'Galerie',
    blog: 'Conseils',
    contact: 'Contact',
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Home page
  // ───────────────────────────────────────────────────────────────────────────
  home: {
    seo: {
      // Title formula: primary keyword + city + brand, under ~60 characters so
      // it is not truncated in the results page.
      title: 'Salle de sport à Berrechid — Fitness Hamouchi Gym',
      description:
        'Deux salles de sport à Berrechid : musculation, cross training, cardio, boxe et fitness femmes. Coachs diplômés, ouvert 7j/7. Séance d’essai gratuite.',
      // Keywords a human would actually type. Used for internal tracking and
      // the content brief — not injected as a meta keywords tag, which Google
      // has ignored since 2009.
      targets: [
        'salle de sport berrechid',
        'salle de musculation berrechid',
        'gym berrechid',
        'fitness berrechid',
        'club nour berrechid',
        'fitness hamouchi',
        'coach sportif berrechid',
        'salle de sport femme berrechid',
      ],
    },
    hero: {
      // Split across lines so the display type can stagger them on reveal.
      kicker: 'Berrechid · Deux clubs · Ouvert 7j/7',
      titleLines: ['Deviens', 'la version', 'la plus forte', 'de toi'],
      lead:
        'Musculation, cross training, cardio et boxe dans deux salles entièrement équipées à Berrechid. Des coachs qui corrigent ta technique, un programme qui te correspond, une ambiance qui te fait revenir.',
      primaryCta: 'Réserver ma séance gratuite',
      secondaryCta: 'Découvrir les clubs',
      scrollHint: 'Faites défiler',
    },
    stats: {
      title: 'Ce que ça représente',
      members: 'membres actifs',
      years: 'ans d’expérience',
      coaches: 'coachs diplômés',
      surface: 'm² d’espace',
    },
    intro: {
      kicker: 'Qui nous sommes',
      title: 'Une salle de quartier, des standards de compétition',
      body: [
        'Fitness Hamouchi Gym est né à Berrechid d’une idée simple : on n’a pas besoin d’aller à Casablanca pour s’entraîner sérieusement. Deux clubs, du matériel qu’on remplace quand il s’use, et des coachs présents sur le plateau — pas derrière un comptoir.',
        'Que tu pousses de la fonte depuis dix ans ou que tu n’aies jamais mis les pieds dans une salle, on commence là où tu en es. On t’explique les mouvements, on surveille ta posture, et on ajuste au fur et à mesure.',
      ],
      bullets: [
        'Bilan et programme personnalisé offerts à l’inscription',
        'Coach sur le plateau à toutes les heures d’ouverture',
        'Aucun frais d’adhésion caché, aucun engagement forcé',
        'Espace et créneaux dédiés aux femmes',
      ],
      cta: 'Rencontrer l’équipe',
    },
    disciplines: {
      kicker: 'Les disciplines',
      title: 'Choisis ton terrain de jeu',
      lead:
        'Cinq disciplines encadrées, toutes incluses dans l’abonnement. Change quand tu veux, combine comme tu veux.',
    },
    clubs: {
      kicker: 'Nos adresses',
      title: 'Deux clubs à Berrechid',
      lead:
        'Chaque club a son caractère et son matériel. Ton abonnement te donne accès à celui que tu choisis — demande-nous pour l’accès aux deux.',
    },
    coach: {
      kicker: 'L’encadrement',
      title: 'Tu ne t’entraînes jamais seul',
      body: [
        'Khalid Hamouchi coache à Berrechid depuis plus de dix ans. Il a monté les deux clubs autour d’une conviction : un bon coach ne compte pas les répétitions, il corrige le mouvement avant que la blessure arrive.',
        'L’équipe suit la même règle. Si tu te trompes sur un soulevé de terre, quelqu’un viendra te le dire — gentiment, mais il viendra.',
      ],
      cta: 'En savoir plus sur l’équipe',
    },
    gallery: {
      kicker: 'En images',
      title: 'À l’intérieur des clubs',
      lead: 'Le plateau, le matériel, l’ambiance. Viens voir en vrai, c’est encore mieux.',
    },
    pricing: {
      kicker: 'Les tarifs',
      title: 'Des prix clairs, affichés',
      lead:
        'Tout est inclus : accès libre, cours collectifs, vestiaires et douches. Pas de frais de dossier, pas de surprise au deuxième mois.',
    },
    faq: {
      kicker: 'Vos questions',
      title: 'Ce qu’on nous demande le plus',
    },
    cta: {
      kicker: 'On commence quand ?',
      title: 'Ta première séance est offerte',
      lead:
        'Viens t’entraîner une fois, gratuitement, sans rien signer. Tu visites, tu testes le matériel, tu parles au coach. Si ça te plaît, on en reparle.',
      primary: 'Réserver ma séance gratuite',
      secondary: 'Nous appeler',
    },
    blog: {
      kicker: 'Le blog',
      title: 'Conseils d’entraînement',
      lead: 'Des articles écrits par nos coachs, pour s’entraîner mieux et éviter les erreurs classiques.',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Disciplines. `slug` builds the URL, so keep it lowercase and hyphenated.
  // ───────────────────────────────────────────────────────────────────────────
  disciplines: [
    {
      slug: 'musculation',
      name: 'Musculation',
      tagline: 'Force, masse, définition',
      short: 'Charges libres, machines guidées et un plateau assez grand pour ne jamais attendre.',
      description:
        'Le cœur de nos deux clubs. Racks à squat, bancs réglables, haltères jusqu’aux charges lourdes, poulies et machines guidées pour chaque groupe musculaire. Un coach passe sur le plateau pour corriger les placements et ajuster les charges.',
      bullets: [
        'Racks, bancs et barres olympiques en nombre suffisant',
        'Haltères par paliers de 2 kg jusqu’aux charges lourdes',
        'Programme de prise de masse ou de sèche selon ton objectif',
        'Suivi des charges et des mesures tous les mois',
      ],
      image: 'discipline-musculation',
      level: 'Tous niveaux',
      duration: 'Accès libre',
    },
    {
      slug: 'cross-training',
      name: 'Cross training',
      tagline: 'Intense, varié, jamais deux fois pareil',
      short: 'Du conditionnement physique complet en circuits courts et intenses.',
      description:
        'Des séances qui mélangent haltérophilie, gymnastique et cardio dans un format chronométré. Chaque mouvement a une version adaptée, donc un débutant et un athlète peuvent faire la même séance côte à côte à leur niveau.',
      bullets: [
        'Séances encadrées en petit groupe',
        'Kettlebells, cordes, pneus, anneaux et box',
        'Chaque mouvement adapté à ton niveau',
        'Excellent pour la perte de gras et le souffle',
      ],
      image: 'discipline-cross-training',
      level: 'Adapté à tous',
      duration: '60 min',
    },
    {
      slug: 'cardio',
      name: 'Cardio',
      tagline: 'Souffle, endurance, perte de poids',
      short: 'Tapis, vélos, rameurs et elliptiques, avec des protocoles qui marchent vraiment.',
      description:
        'Une zone cardio complète et, surtout, quelqu’un pour te dire quoi y faire. Marcher une heure en regardant son téléphone ne brûle pas grand-chose : on te donne des protocoles d’intervalles courts et efficaces.',
      bullets: [
        'Tapis de course, vélos, rameurs, elliptiques',
        'Protocoles HIIT et endurance fondamentale',
        'Mesure des progrès en fréquence cardiaque',
        'Idéal en complément de la musculation',
      ],
      image: 'discipline-cardio',
      level: 'Tous niveaux',
      duration: 'Accès libre',
    },
    {
      slug: 'boxe',
      name: 'Boxe & sports de combat',
      tagline: 'Technique, réflexes, confiance',
      short: 'Sacs, pattes d’ours et travail technique encadré par un coach.',
      description:
        'Du travail de pieds, des combinaisons, du sac et des pattes d’ours. On apprend à frapper proprement avant de frapper fort — c’est comme ça qu’on progresse sans se blesser les poignets et les épaules.',
      bullets: [
        'Sacs lourds, poires de vitesse, pattes d’ours',
        'Travail technique et déplacements',
        'Conditionnement spécifique au combat',
        'Aucune expérience requise pour commencer',
      ],
      image: 'discipline-boxe',
      level: 'Débutant à confirmé',
      duration: '60 min',
    },
    {
      slug: 'fitness-femmes',
      name: 'Fitness femmes',
      tagline: 'Un espace, des créneaux, ton rythme',
      short: 'Espace et horaires dédiés, encadrement féminin, zéro regard de travers.',
      description:
        'Beaucoup de femmes veulent s’entraîner sérieusement sans se sentir observées. On a donc un espace dédié et des créneaux réservés, avec un encadrement qui connaît les objectifs spécifiques — renforcement, tonification, remise en forme après grossesse.',
      bullets: [
        'Espace et créneaux réservés aux femmes',
        'Encadrement féminin',
        'Renforcement, tonification, remise en forme',
        'Cours collectifs d’aérobic et de stretching',
      ],
      image: 'discipline-fitness-femmes',
      level: 'Tous niveaux',
      duration: '45–60 min',
    },
    {
      slug: 'aerobic',
      name: 'Aérobic & cours collectifs',
      tagline: 'Musique, groupe, bonne humeur',
      short: 'Des cours collectifs qui passent vite et qui font transpirer.',
      description:
        'Aérobic, step, stretching et renforcement en musique. Le format collectif a un avantage que rien ne remplace : on vient parce que le groupe nous attend.',
      bullets: [
        'Plusieurs cours par semaine',
        'Aérobic, step, stretching, renforcement',
        'Inclus dans tous les abonnements',
        'Ambiance collective et motivante',
      ],
      image: 'discipline-aerobic',
      level: 'Tous niveaux',
      duration: '45 min',
    },
    {
      slug: 'coaching-personnel',
      name: 'Coaching personnel',
      tagline: 'Un coach, pour toi seul',
      short: 'Un accompagnement individuel, programme et nutrition compris.',
      description:
        'Pour un objectif précis et daté — une compétition, une perte de poids importante, un retour après blessure. Séances individuelles, programme écrit, ajustements nutritionnels et suivi des mesures.',
      bullets: [
        'Séances en tête-à-tête',
        'Programme écrit et révisé chaque mois',
        'Conseils nutritionnels adaptés au Maroc',
        'Suivi des mesures et des performances',
      ],
      image: 'discipline-coaching',
      level: 'Sur mesure',
      duration: '60 min',
    },
  ],

  // Amenity labels, keyed by the ids used in locations[].amenities
  amenities: {
    musculation: 'Plateau musculation',
    cardio: 'Zone cardio',
    crossTraining: 'Espace cross training',
    fitnessFemmes: 'Espace femmes',
    aerobic: 'Salle de cours collectifs',
    coaching: 'Coaching personnel',
    vestiaires: 'Vestiaires',
    douches: 'Douches chaudes',
    parking: 'Parking',
    wifi: 'Wi-Fi gratuit',
    climatisation: 'Climatisation',
    boutique: 'Boutique & compléments',
  },

  // Plan copy, keyed by the ids used in data/site.mjs plans
  plans: {
    seance: {
      name: 'Séance unique',
      tagline: 'Pour tester, ou pour les gens de passage',
      features: ['Accès complet à la salle', 'Cours collectifs du jour', 'Vestiaires et douches', 'Sans engagement'],
    },
    mensuel: {
      name: 'Mensuel',
      tagline: 'La formule la plus choisie',
      features: [
        'Accès libre pendant un mois',
        'Tous les cours collectifs inclus',
        'Bilan et programme personnalisé',
        'Suivi des mesures',
        'Sans frais d’inscription',
      ],
    },
    trimestriel: {
      name: 'Trimestriel',
      tagline: 'Trois mois, le temps que ça devienne une habitude',
      features: [
        'Accès libre pendant trois mois',
        'Tous les cours collectifs inclus',
        'Bilan et programme personnalisé',
        'Révision du programme chaque mois',
        'Tarif dégressif',
      ],
    },
    annuel: {
      name: 'Annuel',
      tagline: 'Le meilleur rapport qualité-prix',
      features: [
        'Accès libre pendant un an',
        'Tous les cours collectifs inclus',
        'Bilan et programme personnalisé',
        'Suivi mensuel avec un coach',
        'Le tarif mensuel le plus bas',
      ],
    },
    coaching: {
      name: 'Coaching personnel',
      tagline: 'Un accompagnement individuel',
      features: [
        'Séances en tête-à-tête',
        'Programme écrit et personnalisé',
        'Conseils nutritionnels',
        'Suivi rapproché des progrès',
        'Abonnement salle inclus',
      ],
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Secondary pages
  // ───────────────────────────────────────────────────────────────────────────
  pages: {
    clubs: {
      seo: {
        title: 'Nos salles de sport à Berrechid',
        description:
          'Les deux clubs Fitness Hamouchi à Berrechid : adresses, horaires d’ouverture, équipements et disciplines de chaque salle. Ouvert 7j/7.',
      },
      // Patterns for the per-club pages. {name} is the club's short name and
      // {city} its locality — leading with the city matches how people
      // actually search ("salle de sport berrechid"), and keeps each club's
      // title distinct from the other's.
      titlePattern: '{name} — Salle de sport à {city}',
      descPattern:
        '{name} : adresse, horaires, équipements et disciplines de cette salle de sport à {city}. Ouvert 7j/7, première séance d’essai gratuite.',
      kicker: 'Nos adresses',
      title: 'Deux clubs, un même niveau d’exigence',
      lead:
        'Choisis le club le plus proche de chez toi. Les deux sont équipés pour la musculation et le cardio, chacun avec sa spécialité.',
    },
    disciplines: {
      seo: {
        title: 'Cours : musculation, cross training, boxe',
        description:
          'Musculation, cross training, cardio, boxe, fitness femmes et aérobic à Berrechid. Toutes les disciplines sont incluses dans l’abonnement et encadrées.',
      },
      kicker: 'Les disciplines',
      title: 'Tout est inclus dans l’abonnement',
      lead:
        'Sept façons de t’entraîner chez nous. Aucune ne coûte un supplément : tu changes de discipline quand tu veux, tu les combines si ça te va.',
    },
    pricing: {
      seo: {
        title: 'Tarifs et abonnements',
        description:
          'Tarifs clairs pour nos salles de sport à Berrechid : séance unique, abonnement mensuel, trimestriel ou annuel. Tout inclus, sans frais d’inscription.',
      },
      kicker: 'Les tarifs',
      title: 'Nos abonnements',
      lead:
        'Un seul tarif, tout compris. Accès libre, cours collectifs, vestiaires, douches et suivi par un coach — rien n’est facturé en plus.',
      includedTitle: 'Inclus dans tous les abonnements',
      included: [
        'Accès libre pendant toute la durée de l’abonnement',
        'Tous les cours collectifs au programme',
        'Bilan de départ et programme personnalisé',
        'Vestiaires, casiers et douches chaudes',
        'Conseils d’un coach présent sur le plateau',
        'Aucun frais d’inscription ni frais de dossier',
      ],
      notesTitle: 'Bon à savoir',
      notes: [
        'Les tarifs affichés sont en dirhams et par personne.',
        'Tarifs réduits pour les étudiants et les inscriptions à plusieurs — demandez-nous.',
        'Le paiement se fait à l’accueil du club, en espèces ou par carte.',
        'La séance d’essai est gratuite et sans engagement.',
      ],
    },
    coach: {
      seo: {
        title: 'Khalid Hamouchi, coach sportif',
        description:
          'Khalid Hamouchi, fondateur de Fitness Hamouchi Gym, coache à Berrechid depuis plus de dix ans. Découvrez l’équipe et notre méthode d’encadrement.',
      },
      kicker: 'L’équipe',
      title: 'Les gens qui vont t’entraîner',
      lead: 'Un club, c’est d’abord ceux qui sont sur le plateau avec toi.',
      methodTitle: 'Notre méthode, en quatre principes',
      method: [
        {
          title: 'La technique avant la charge',
          body:
            'On ne met pas de poids sur une barre tant que le mouvement n’est pas propre. C’est plus lent les deux premières semaines, et beaucoup plus rapide les deux années suivantes.',
        },
        {
          title: 'Un programme écrit, pas improvisé',
          body:
            'Chaque membre repart avec un programme sur papier, adapté à son objectif, son niveau et le nombre de séances qu’il peut réellement faire par semaine.',
        },
        {
          title: 'Des chiffres, pas des impressions',
          body:
            'On mesure les charges, les tours de taille et les performances. C’est la seule façon de savoir si un programme marche, et de le corriger s’il ne marche pas.',
        },
        {
          title: 'On corrige, même sans qu’on te le demande',
          body:
            'Si ton dos s’arrondit sur un soulevé de terre, un coach viendra te le dire. C’est le travail, et c’est ce qui évite les blessures qui arrêtent tout pendant six mois.',
        },
      ],
    },
    gallery: {
      seo: {
        title: 'Galerie photo de nos salles',
        description:
          'Photos de nos deux salles de sport à Berrechid : plateau musculation, zone cardio, espace cross training, vestiaires et cours collectifs.',
      },
      kicker: 'En images',
      title: 'Nos clubs en photos',
      lead: 'Le matériel, les espaces et l’ambiance. La visite sur place reste la meilleure option.',
    },
    contact: {
      seo: {
        title: 'Contact et accès',
        description:
          'Contactez Fitness Hamouchi Gym à Berrechid : téléphone, WhatsApp, adresses des deux clubs, horaires d’ouverture et itinéraire.',
      },
      kicker: 'Contact',
      title: 'Passe nous voir, ou écris-nous',
      lead:
        'Le plus simple reste de venir au club : on te fait visiter et tu t’entraînes une fois gratuitement. Sinon, WhatsApp est le canal où on répond le plus vite.',
      formTitle: 'Écrivez-nous',
      formNote:
        'Ce formulaire ouvre votre application de messagerie avec le message prérempli. Pour une réponse immédiate, utilisez WhatsApp.',
      form: {
        name: 'Nom',
        namePlaceholder: 'Votre nom',
        phone: 'Téléphone',
        phonePlaceholder: '06 00 00 00 00',
        club: 'Club souhaité',
        goal: 'Votre objectif',
        goals: [
          'Perte de poids',
          'Prise de masse',
          'Remise en forme',
          'Préparation physique',
          'Coaching personnel',
          'Je ne sais pas encore',
        ],
        message: 'Message',
        messagePlaceholder: 'Dites-nous en quelques mots ce que vous cherchez…',
        submit: 'Envoyer le message',
        whatsappInstead: 'Ou écrivez-nous directement sur WhatsApp',
      },
      hoursTitle: 'Horaires d’ouverture',
      findUsTitle: 'Nous trouver',
    },
    blog: {
      seo: {
        title: 'Conseils d’entraînement et de nutrition',
        description:
          'Articles écrits par les coachs de Fitness Hamouchi Gym à Berrechid : programmes d’entraînement, technique, nutrition et conseils pour débuter.',
      },
      kicker: 'Le blog',
      title: 'Conseils d’entraînement',
      lead:
        'Ce que nos coachs répètent le plus souvent sur le plateau, écrit noir sur blanc pour que tu puisses t’y référer.',
    },
    notFound: {
      seo: { title: 'Page introuvable', description: 'Cette page n’existe pas ou a été déplacée.' },
      title: 'Cette page n’existe pas',
      lead: 'Le lien est peut-être cassé, ou la page a été déplacée. Voici par où continuer.',
      cta: 'Retour à l’accueil',
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // FAQ — rendered on the home page and marked up as FAQPage structured data,
  // which is what makes these questions eligible to appear directly in Google.
  // Write answers that fully answer the question in the first two sentences.
  // ───────────────────────────────────────────────────────────────────────────
  faq: [
    {
      q: 'Où se trouvent vos salles de sport à Berrechid ?',
      a: 'Nous avons deux clubs à Berrechid : Fitness Hamouchi Gym et Club Nour. Les deux adresses, avec itinéraire et horaires, sont sur la page Nos clubs. Appelez-nous si vous hésitez sur le club le plus proche de chez vous.',
    },
    {
      q: 'La première séance est-elle vraiment gratuite ?',
      a: 'Oui. Vous venez, vous visitez le club, vous faites une séance complète avec un coach et vous repartez sans rien signer. Apportez simplement une tenue de sport, des baskets propres et une serviette.',
    },
    {
      q: 'Combien coûte un abonnement ?',
      a: 'Tous nos tarifs sont affichés sur la page Tarifs : séance unique, mensuel, trimestriel et annuel. Il n’y a aucun frais d’inscription ni frais de dossier, et les cours collectifs sont inclus dans tous les abonnements.',
    },
    {
      q: 'Faut-il de l’expérience pour commencer ?',
      a: 'Non, et c’est le cas de la plupart de nos nouveaux membres. À l’inscription, un coach fait un bilan de votre niveau, vous montre les mouvements de base et vous remet un programme écrit adapté au nombre de séances que vous pouvez faire par semaine.',
    },
    {
      q: 'Y a-t-il un espace réservé aux femmes ?',
      a: 'Oui. Nous avons un espace dédié et des créneaux réservés aux femmes, avec un encadrement féminin. Les cours collectifs d’aérobic et de renforcement sont également programmés sur ces créneaux.',
    },
    {
      q: 'Quels sont vos horaires d’ouverture ?',
      a: 'Nous ouvrons du lundi au vendredi de 6h à 23h, le samedi de 8h à 22h et le dimanche de 9h à 14h. Les horaires peuvent être adaptés pendant le Ramadan — nous les annonçons sur Instagram et Facebook.',
    },
    {
      q: 'Proposez-vous du coaching personnel ?',
      a: 'Oui, en séances individuelles avec programme écrit, conseils nutritionnels et suivi des mesures. C’est la formule à choisir pour un objectif précis et daté, comme une perte de poids importante ou un retour après blessure.',
    },
    {
      q: 'Que faut-il apporter pour s’entraîner ?',
      a: 'Une tenue de sport, une paire de baskets propres réservée à la salle, une serviette et une bouteille d’eau. Les vestiaires, les casiers et les douches chaudes sont inclus dans l’abonnement.',
    },
  ],

  // ───────────────────────────────────────────────────────────────────────────
  // Blog articles.
  //
  // This section is the engine of the whole SEO strategy. A gym site with five
  // static pages competes for maybe eight keywords. Articles that genuinely
  // answer what people search — "how much does a gym cost in Morocco",
  // "beginner programme" — bring in visitors months before they are ready to
  // sign up, and they are already reading your name when they are.
  //
  // `body` is HTML. Keep one <h2> per section, keep paragraphs short, and link
  // internally with {{pricing}}, {{clubs}}, {{contact}}, {{disciplines}} —
  // the generator rewrites those into correct localised URLs.
  // ───────────────────────────────────────────────────────────────────────────
  articles: [
    {
      slug: 'choisir-salle-de-sport-berrechid',
      date: '2026-01-14',
      updated: '2026-09-02',
      image: 'article-choisir-salle',
      // `title` is the on-page H1 and the headline in structured data.
      // `seoTitle` is the shorter <title> that fits the ~60-character budget
      // once the brand is appended — a truncated title in results loses the
      // end of the sentence, which is usually where the keyword sits.
      seoTitle: 'Choisir sa salle de sport à Berrechid',
      title: 'Comment choisir sa salle de sport à Berrechid : 7 critères concrets',
      description:
        'Matériel, encadrement, horaires, propreté, tarifs : les sept critères à vérifier avant de signer un abonnement dans une salle de sport à Berrechid.',
      targets: ['salle de sport berrechid', 'choisir salle de sport', 'meilleure salle de sport berrechid'],
      body: `
<p>Berrechid compte aujourd’hui une dizaine de salles de sport, et elles ne se valent pas. Avant de signer un abonnement — surtout un abonnement annuel — voici les sept points que nous conseillons de vérifier, même si c’est pour aller chez un concurrent.</p>

<h2>1. Le matériel disponible aux heures où vous venez</h2>
<p>Une salle peut sembler parfaitement équipée à 15h et devenir inutilisable à 19h. Visitez à l’heure où vous comptez réellement vous entraîner, et comptez les postes essentiels : combien de racks à squat, combien de bancs réglables, est-ce que les haltères montent assez haut pour vous dans six mois.</p>
<p>Un seul rack pour quarante personnes à l’heure de pointe, c’est trente minutes d’attente par séance.</p>

<h2>2. La présence réelle d’un coach sur le plateau</h2>
<p>C’est le critère qui fait la plus grande différence sur une année, et le plus facile à vérifier : pendant votre visite, regardez simplement où se trouve le coach. Sur le plateau en train de corriger des postures, ou derrière le comptoir sur son téléphone ?</p>
<p>Un coach présent vous évite les deux choses qui arrêtent les débutants : la blessure au bas du dos, et les six mois d’entraînement sans résultat parce que l’exécution n’était pas bonne.</p>

<h2>3. L’état des vestiaires et des douches</h2>
<p>Les vestiaires sont un bon indicateur de la gestion générale d’un club. Si les douches sont froides ou sales en pleine journée, demandez-vous ce qui se passe pour l’entretien du matériel, qu’on voit moins.</p>

<h2>4. Les horaires, honnêtement</h2>
<p>Vérifiez l’heure d’ouverture et surtout l’heure réelle de fermeture — certaines salles éteignent les lumières vingt minutes avant l’heure affichée. Si vous travaillez en horaires décalés, c’est le critère qui déterminera si vous venez trois fois par semaine ou deux fois par mois.</p>
<p>Nos deux clubs ouvrent à 6h en semaine et ferment à 23h, précisément pour cette raison. Les horaires détaillés de chaque club sont sur la page {{clubs}}.</p>

<h2>5. Ce que le tarif inclut vraiment</h2>
<p>Un abonnement à 200 dirhams qui facture les cours collectifs en supplément coûte plus cher qu’un abonnement à 250 dirhams tout compris. Posez les questions dans l’ordre : frais d’inscription, frais de dossier, cours collectifs, accès aux autres clubs, bilan de départ.</p>
<p>Demandez aussi ce qui se passe si vous partez trois semaines en vacances, et si l’abonnement se renouvelle automatiquement. Nos tarifs, et ce qu’ils comprennent, sont affichés sur la page {{pricing}}.</p>

<h2>6. Un programme de départ, ou pas</h2>
<p>Une salle sérieuse ne vous laisse pas errer entre les machines le premier jour. Demandez si l’inscription comprend un bilan et un programme écrit, et sur quoi il est basé : votre objectif, votre niveau, et surtout le nombre de séances que vous pouvez tenir chaque semaine.</p>
<p>Un programme sur cinq séances donné à quelqu’un qui peut venir deux fois par semaine ne sert à rien.</p>

<h2>7. L’ambiance, à l’heure de pointe</h2>
<p>Ce critère est subjectif et c’est pourtant celui qui vous fera revenir ou abandonner au bout de six semaines. Est-ce qu’on vous dit bonjour ? Est-ce que les gens remettent les poids en place ? Est-ce que vous vous sentez à votre place ?</p>
<p>Pour les femmes, ajoutez une question directe : y a-t-il un espace ou des créneaux dédiés, et un encadrement féminin ?</p>

<h2>Le test qui résume tout</h2>
<p>Demandez une séance d’essai gratuite. Une salle qui refuse de vous laisser essayer avant de payer vous dit quelque chose d’important sur la suite.</p>
<p>Chez nous, la séance d’essai est gratuite, complète et sans engagement : vous visitez, vous vous entraînez avec un coach, vous repartez. {{contact}} pour choisir un créneau.</p>
`,
    },
    {
      slug: 'programme-musculation-debutant',
      date: '2026-02-20',
      updated: '2026-08-18',
      image: 'article-programme-debutant',
      seoTitle: 'Programme musculation débutant',
      title: 'Programme de musculation débutant : vos 4 premières semaines',
      description:
        'Un programme de musculation pour débutant sur 4 semaines, 3 séances par semaine : exercices, séries, répétitions et les erreurs à éviter au début.',
      targets: ['programme musculation débutant', 'programme musculation 3 jours', 'débuter la musculation'],
      body: `
<p>La plupart des débutants font la même erreur : copier le programme d’un pratiquant avancé trouvé en ligne. Cinq séances par semaine, quinze exercices par séance, et un abandon au bout d’un mois. Voici ce que nous donnons réellement à nos nouveaux membres.</p>

<h2>Le principe : trois séances, tout le corps</h2>
<p>Pendant les premières semaines, votre progression ne vient pas du volume d’entraînement mais de l’apprentissage du mouvement. Votre système nerveux apprend à recruter les muscles dans le bon ordre, et cela va vite — c’est pour ça qu’on progresse si rapidement au début.</p>
<p>Trois séances complètes par semaine, avec un jour de repos entre chaque, suffisent largement. Par exemple lundi, mercredi, vendredi.</p>

<h2>La séance, dans l’ordre</h2>
<p>Les mêmes six exercices à chaque séance. C’est volontairement répétitif : on répète pour apprendre.</p>
<ol>
  <li><strong>Squat</strong> — 3 séries de 8 répétitions</li>
  <li><strong>Développé couché</strong> ou développé sur machine — 3 × 8</li>
  <li><strong>Rowing</strong> (tirage horizontal) — 3 × 10</li>
  <li><strong>Développé épaules</strong> — 3 × 10</li>
  <li><strong>Soulevé de terre jambes tendues</strong> — 3 × 10</li>
  <li><strong>Gainage</strong> — 3 × 30 secondes</li>
</ol>
<p>Deux minutes de repos entre les séries sur les trois premiers exercices, une minute trente sur le reste. Comptez-les sur votre téléphone : la plupart des débutants se reposent trop peu et finissent par baisser les charges.</p>

<h2>Quelle charge choisir</h2>
<p>Commencez plus léger que ce que votre ego suggère. La bonne charge de départ est celle avec laquelle vous pourriez faire deux à trois répétitions de plus que prévu, en gardant une exécution parfaite.</p>
<p>Ensuite, la règle est simple : quand vous terminez toutes vos séries au nombre de répétitions prévu sans dégrader la technique, vous ajoutez environ 2,5 kg à la séance suivante. C’est tout. Cette progression lente et régulière battra n’importe quel programme compliqué.</p>

<h2>Les quatre semaines, en pratique</h2>
<p><strong>Semaine 1</strong> — Charges légères, l’objectif est uniquement d’apprendre les six mouvements. Faites-vous corriger sur chacun d’eux.</p>
<p><strong>Semaine 2</strong> — Mêmes exercices, charges légèrement augmentées. Vous allez avoir des courbatures : c’est normal, et cela diminuera.</p>
<p><strong>Semaine 3</strong> — La technique commence à être automatique. Montez les charges plus franchement sur le squat et le rowing.</p>
<p><strong>Semaine 4</strong> — Notez vos charges sur chaque exercice. C’est votre point de référence pour le programme suivant, qui pourra passer à quatre séances et séparer haut et bas du corps.</p>

<h2>Les erreurs qui coûtent le plus cher</h2>
<p><strong>Changer de programme toutes les deux semaines.</strong> Un programme moyen suivi trois mois donne de bien meilleurs résultats qu’un excellent programme suivi dix jours.</p>
<p><strong>Sauter les jambes.</strong> C’est le groupe musculaire qui déclenche le plus de réponse hormonale et qui transforme le plus une silhouette.</p>
<p><strong>Négliger le sommeil et les protéines.</strong> Le muscle se construit pendant le repos. Sept à huit heures de sommeil, et une source de protéines à chaque repas, feront plus pour vous que n’importe quel complément.</p>
<p><strong>S’entraîner sans jamais se faire corriger.</strong> Vous ne voyez pas votre propre dos s’arrondir sur un soulevé de terre. Quelqu’un doit le voir pour vous.</p>

<h2>Et après ?</h2>
<p>Au bout de quatre à six semaines, ce programme a fait son travail et il faut le faire évoluer. C’est le moment de passer sur quatre séances, d’ajouter du volume et de choisir une direction : prise de masse ou perte de gras.</p>
<p>À Berrechid, nous remettons ce bilan et ce programme à chaque inscription, et nous le révisons chaque mois. Voyez nos {{disciplines}} pour la suite, ou {{contact}} pour venir faire une séance d’essai gratuite.</p>
`,
    },
    {
      slug: 'prix-salle-de-sport-maroc',
      date: '2026-03-11',
      updated: '2026-09-20',
      image: 'article-prix-salle',
      seoTitle: 'Prix d’une salle de sport au Maroc',
      title: 'Prix d’une salle de sport au Maroc en 2026 : à quoi s’attendre',
      description:
        'Combien coûte un abonnement de salle de sport au Maroc en 2026 ? Fourchettes de prix par ville et par type de club, et les frais cachés à vérifier.',
      targets: ['prix salle de sport maroc', 'tarif salle de sport berrechid', 'abonnement salle de sport prix'],
      body: `
<p>« Combien ça coûte ? » est la première question qu’on nous pose au téléphone, et la réponse varie énormément d’un club à l’autre. Voici les fourchettes réelles du marché marocain en 2026, et surtout comment comparer deux offres qui n’incluent pas la même chose.</p>

<h2>Les trois segments du marché</h2>
<p><strong>Les salles de quartier</strong> — Comptez entre 150 et 300 dirhams par mois. Matériel essentiel, plateau de musculation, zone cardio. La qualité dépend presque entièrement de l’encadrement : deux salles au même prix peuvent offrir des expériences totalement différentes selon qu’un coach est présent ou non.</p>
<p><strong>Les clubs intermédiaires</strong> — Entre 300 et 600 dirhams par mois. Matériel plus complet et renouvelé, cours collectifs au programme, souvent un espace femmes et une climatisation qui fonctionne.</p>
<p><strong>Les clubs premium et les chaînes</strong> — De 600 à 1 500 dirhams par mois, principalement à Casablanca, Rabat et Marrakech. Piscine, spa, cours en studio, application de réservation.</p>

<h2>Ce que la ville change</h2>
<p>À Casablanca et Rabat, les loyers tirent les prix vers le haut : un club intermédiaire y démarre souvent là où un bon club de province plafonne. Dans les villes moyennes comme Berrechid, Settat ou El Jadida, on trouve un encadrement sérieux entre 200 et 350 dirhams par mois.</p>
<p>C’est l’arbitrage réel pour beaucoup d’habitants de Berrechid : payer plus cher et ajouter quarante minutes de route vers Casablanca, ou s’entraîner sur place dans un club bien équipé.</p>

<h2>Les frais qui ne sont pas dans le prix affiché</h2>
<p>Un prix mensuel ne veut rien dire tant que vous n’avez pas posé ces questions :</p>
<ul>
  <li><strong>Frais d’inscription ou de dossier</strong> — de 0 à 300 dirhams en une fois, rarement annoncés spontanément.</li>
  <li><strong>Cours collectifs</strong> — inclus, ou facturés par séance ? C’est l’écart le plus fréquent entre deux offres qui semblent identiques.</li>
  <li><strong>Bilan et programme de départ</strong> — offert, ou vendu comme une prestation de coaching ?</li>
  <li><strong>Casier et serviette</strong> — gratuits ou en supplément mensuel.</li>
  <li><strong>Reconduction automatique</strong> — vérifiez la durée du préavis avant de signer un engagement de douze mois.</li>
</ul>

<h2>Mensuel ou annuel ?</h2>
<p>Un abonnement annuel coûte généralement l’équivalent de huit à dix mois, soit 20 à 30 % d’économie. C’est intéressant à une condition : être déjà sûr de sa régularité.</p>
<p>Notre conseil aux débutants est de commencer par un mois ou un trimestre. Vous vérifiez d’abord que vous venez vraiment trois fois par semaine, puis vous passez à l’annuel en connaissance de cause. Une salle honnête vous dira la même chose.</p>

<h2>Comment comparer correctement deux offres</h2>
<p>Ramenez tout au coût par séance réellement effectuée. Un abonnement à 250 dirhams utilisé douze fois par mois revient à 21 dirhams la séance. Le même abonnement utilisé quatre fois revient à 62 dirhams.</p>
<p>Cela signifie que le critère le plus important du prix n’est pas le prix : c’est tout ce qui vous fait revenir. La proximité, les horaires compatibles avec votre travail, un coach qui vous connaît, du matériel disponible à 19h.</p>

<h2>Nos tarifs à Berrechid</h2>
<p>Nous affichons nos prix publiquement, tout compris et sans frais d’inscription : accès libre, cours collectifs, bilan de départ, programme écrit, vestiaires et douches. Le détail est sur la page {{pricing}}.</p>
<p>Et parce qu’aucun tableau de prix ne remplace une visite, la première séance est gratuite et sans engagement. {{contact}} pour réserver un créneau, ou passez directement dans l’un de nos {{clubs}}.</p>
`,
    },
  ],

  // Footer
  footer: {
    tagline: 'Deux salles de sport à Berrechid. Musculation, cross training, cardio, boxe et fitness femmes.',
    builtNote: 'Salle de sport à Berrechid, région Casablanca-Settat, Maroc.',
  },
};
