export type OptionalText = string | null;

export const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";

function publicImagePath(value: string | undefined): OptionalText {
  const normalized = value?.trim().replaceAll("\\", "/");
  if (!normalized || /^[a-z][a-z0-9+.-]*:/i.test(normalized)) return null;
  const withoutPublicPrefix = normalized.replace(/^\.?\/?public\//, "/");
  const path = withoutPublicPrefix.startsWith("/") ? withoutPublicPrefix : `/${withoutPublicPrefix}`;
  return path.includes("..") ? null : path;
}

/**
 * Fichier unique de personnalisation du template.
 * Pour un autre salon, modifier les valeurs de cet objet sans toucher aux composants.
 */
export const siteContent = {
  brand: {
    name: "Coiffure Test",
    shortName: "Coiffure Test",
    tagline: "Salon de coiffure homme, enfant et barbe à Ville Exemple.",
    logoPath: null as OptionalText,
  },

  business: {
    type: "Salon de coiffure homme / barber shop",
    responsible: "Jean",
    locationLabel: "Ville Exemple",
  },

  contact: {
    phone: "0000 00 00 00",
    phoneHref: "+32000000000",
    address: "Rue de l’Exemple 1, 0000 Ville Exemple, Belgique",
    addressLines: ["Rue de l’Exemple 1", "0000 Ville Exemple", "Belgique"],
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Rue%20de%20l%27Exemple%201%2C%200000%20Ville%20Exemple%2C%20Belgique",
    openingHours: [
      { day: "Lundi", hours: "Fermé" },
      { day: "Mardi", hours: "Fermé" },
      { day: "Mercredi", hours: "10h00 – 16h40" },
      { day: "Jeudi", hours: "10h00 – 16h40" },
      { day: "Vendredi", hours: "09h00 – 16h40" },
      { day: "Samedi", hours: "10h00 – 16h00" },
      { day: "Dimanche", hours: "10h00 – 16h00" },
    ],
  },

  services: [
    { name: "Coupe enfant -12 ans", description: "Coupe de cheveux pour les enfants de moins de 12 ans.", price: "20 €", duration: "Environ 20 minutes" },
    { name: "Coupe cheveux", description: "Coupe homme.", price: "25 €", duration: "Environ 20 minutes" },
    { name: "Coupe + barbe complète", description: "Coupe de cheveux accompagnée d’une prestation complète pour la barbe.", price: "35 €", duration: "Environ 30 minutes" },
    { name: "Barbe complète + dessin", description: "Entretien de la barbe avec travail des contours et de la forme.", price: "15 €", duration: "Environ 20 minutes" },
  ],

  navigation: [
    { href: "/", label: "Accueil" },
    { href: "/#a-propos", label: "À propos" },
    { href: "/prestations", label: "Prestations" },
    { href: "/contact", label: "Contact" },
  ],

  labels: {
    book: "Prendre rendez-vous",
    call: "Appeler le salon",
    find: "Nous trouver",
    viewServices: "Voir toutes les prestations",
    backHome: "Retour à l’accueil",
  },

  seo: {
    defaultTitle: "Coiffure Test : barber shop à Ville Exemple",
    defaultDescription: "Coiffure homme, enfant et barbe à Ville Exemple. Tarifs, horaires et prise de rendez-vous.",
    openGraphDescription: "Coiffure homme, enfant et barbe à Ville Exemple.",
  },

  home: {
    hero: {
      titlePrefix: "Bienvenue chez",
      positioning: "Salon de coiffure homme et barber shop à Ville Exemple.",
      introduction: "Jean vous accueille pour une coupe homme, une coupe enfant ou une prestation de barbe.",
    },
    salon: {
      eyebrow: "Le salon",
      title: "Coiffure Test",
      lead: "Coiffure Test est un salon de coiffure homme et barber shop situé Rue de l’Exemple à Ville Exemple.",
      paragraphs: [
        "Le salon propose des coupes homme, des coupes enfant et l’entretien de la barbe.",
        "Jean reçoit les clients au salon.",
        "Les prestations se font sur rendez-vous, avec réservation en ligne.",
      ],
    },
    about: {
      eyebrow: "À propos",
      title: "Jean",
      lead: "Jean est le responsable et coiffeur de Coiffure Test.",
      paragraphs: [
        "La carte comprend les coupes homme et enfant, la coupe avec barbe et l’entretien de la barbe.",
        "Les tarifs sont affichés pour chaque prestation.",
        "Vous pouvez choisir une prestation et un horaire lors de la réservation en ligne.",
      ],
    },
    services: {
      eyebrow: "Prestations",
      title: "Les prestations du salon",
      introduction: "Retrouvez les principales prestations proposées chez Coiffure Test.",
    },
    booking: {
      eyebrow: "Rendez-vous",
      title: "Réservez votre rendez-vous",
      introduction: "La réservation peut être effectuée directement en ligne. Choisissez la prestation souhaitée, consultez les créneaux disponibles et sélectionnez le moment qui vous convient.",
      stepsTitle: "Comment ça fonctionne ?",
      steps: [
        { number: "01", title: "Choisissez votre prestation", description: "Sélectionnez la coupe ou la prestation de barbe souhaitée." },
        { number: "02", title: "Sélectionnez le coiffeur", description: "Choisissez le professionnel disponible." },
        { number: "03", title: "Choisissez la date et l’heure", description: "Consultez les créneaux disponibles et sélectionnez votre rendez-vous." },
        { number: "04", title: "Indiquez vos coordonnées", description: "Renseignez les informations nécessaires pour finaliser votre réservation." },
      ],
    },
    practical: {
      eyebrow: "Informations pratiques",
      title: "Avant votre rendez-vous",
      lead: "Le salon fonctionne principalement sur rendez-vous.",
      paragraphs: [
        "Les durées indiquées pour les prestations sont approximatives et peuvent légèrement varier selon la demande.",
        "En cas de question ou si vous préférez prendre contact directement avec le salon, vous pouvez appeler Jean au numéro indiqué ci-dessous.",
      ],
    },
    hours: {
      eyebrow: "Horaires",
      title: "Horaires d’ouverture",
      introduction: "Pour éviter l’attente, pensez à réserver votre créneau avant de venir.",
    },
    contact: {
      eyebrow: "Contact",
      title: "Retrouvez Coiffure Test à Ville Exemple",
      introduction: "Le salon est situé Rue de l’Exemple 1 à Ville Exemple.",
      finalEyebrow: "Rendez-vous",
      finalTitle: "Une question ou besoin d’un rendez-vous ?",
      finalText: "Consultez les disponibilités du salon et choisissez directement votre créneau.",
    },
  },

  pages: {
    services: {
      metadataTitle: "Prestations et tarifs",
      metadataDescription: "Prestations, prix et durées de Coiffure Test à Ville Exemple.",
      titleLines: ["Prestations", "et tarifs"],
      introduction: "Coiffure homme, enfant et barbe. Les prix sont indiqués par prestation et les durées sont approximatives.",
      catalogueEyebrow: "Coiffure Test",
      catalogueTitle: "Tarifs",
    },
    contact: {
      metadataTitle: "Contact, adresse et horaires",
      metadataDescription: "Adresse, téléphone et horaires de Coiffure Test à Ville Exemple.",
      title: "Contact",
      introduction: "Coiffure Test se trouve Rue de l’Exemple 1 à Ville Exemple.",
      coordinatesTitle: "Coordonnées",
      aboutEyebrow: "À propos",
      aboutTitle: "Jean",
      aboutText: "Jean est le responsable et coiffeur de Coiffure Test.",
      practicalEyebrow: "Informations pratiques",
      hoursTitle: "Horaires",
      hoursLead: "Le salon est fermé le lundi et le mardi.",
    },
    booking: {
      metadataTitle: "Prendre rendez-vous",
      metadataDescription: "Choisissez une prestation, un coiffeur, une date et une heure.",
      unavailable: {
        eyebrow: "Réservation indisponible",
        title: "La réservation en ligne est momentanément indisponible.",
        text: "Pour prendre rendez-vous, passez par téléphone au",
        retryLabel: "Réessayer",
      },
    },
    confirmation: {
      metadataTitle: "Confirmation du rendez-vous",
      metadataDescription: "Vérification et confirmation de votre demande de rendez-vous.",
    },
    privacy: {
      metadataTitle: "Confidentialité",
      metadataDescription: "Traitement des données lors d’une prise de rendez-vous.",
      title: "Confidentialité",
      sections: [
        { title: "Données collectées", text: "Le formulaire demande le nom, le prénom, l’adresse e-mail, le numéro de téléphone et les informations du rendez-vous." },
        { title: "Utilisation", text: "Ces données sont utilisées pour enregistrer et confirmer le rendez-vous. Elles ne sont pas utilisées à des fins publicitaires." },
        { title: "Mesure d’audience", text: "Ce site n’utilise pas d’outil de mesure d’audience." },
      ],
      rightsTitle: "Vos droits",
      rightsText: "Pour toute demande concernant vos données, contactez le salon au",
    },
    legal: {
      metadataTitle: "Mentions légales",
      metadataDescription: "Mentions légales de Coiffure Test.",
      titleLines: ["Mentions", "légales"],
      publisherTitle: "Éditeur du site",
      additionalTitle: "Informations complémentaires",
      additionalText: "Le numéro d’entreprise, le numéro de TVA et les informations sur l’hébergement restent à compléter.",
      contentTitle: "Contenu du site",
      contentText: "Le contenu de ce site ne peut pas être repris sans autorisation.",
    },
    notFound: {
      eyebrow: "Page introuvable",
      title: "Cette page n’existe pas.",
      text: "Retournez à l’accueil ou prenez rendez-vous.",
    },
  },

  footer: {
    description: "Salon de coiffure homme et barber shop à Ville Exemple.",
    servicesLine: "Coupe homme · Coupe enfant · Barbe",
    exploreTitle: "Explorer",
    informationTitle: "Informations",
    exploreLinks: [
      { href: "/", label: "Accueil" },
      { href: "/prestations", label: "Prestations" },
      { href: "/reservation", label: "Réservation" },
      { href: "/contact", label: "Contact" },
    ],
    informationLinks: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },

  socialImage: {
    headlineLines: ["Coiffure homme,", "enfant et barbe."],
  },

  media: {
    hero: {
      desktopSrc: publicImagePath(process.env.HERO_IMAGE_PATH),
      mobileSrc: publicImagePath(process.env.HERO_IMAGE_MOBILE_PATH),
      alt: process.env.HERO_IMAGE_ALT ?? "",
      fallbackAlt: "Intérieur du salon Coiffure Test à Ville Exemple",
      placeholderLabel: "Coiffure Test à Ville Exemple",
      width: Number(process.env.HERO_IMAGE_WIDTH) || 2400,
      height: Number(process.env.HERO_IMAGE_HEIGHT) || 1600,
      mobileWidth: Number(process.env.HERO_IMAGE_MOBILE_WIDTH) || 1080,
      mobileHeight: Number(process.env.HERO_IMAGE_MOBILE_HEIGHT) || 1440,
      desktopObjectPosition: process.env.HERO_IMAGE_POSITION ?? "center center",
      mobileObjectPosition: process.env.HERO_IMAGE_MOBILE_POSITION ?? "center center",
    },
  },

  legal: {
    publicationDirector: null as OptionalText,
    hostingProvider: null as OptionalText,
  },

  publication: {
    isReady: true,
    analyticsEnabled: false,
  },
} as const;

export const displayBrandName = siteContent.brand.name;
