/**
 * Translations for English and French
 */

export type Language = "en" | "fr";

export interface Translations {
  // Hero Search
  discoverYourMusicLegend: string;
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  searchHint: string;
  viewCard: string;

  // Card
  hp: string;
  weakness: string;
  resistance: string;
  retreat: string;
  deezerLegends: string;

  // Rarity
  legendary: string;
  ultraRare: string;
  rare: string;
  uncommon: string;
  common: string;

  // Buttons
  downloadCard: string;
  shareCard: string;
  searchAnother: string;
  newSearch: string;
  generating: string;
  downloaded: string;

  // Loading & Error
  generatingCard: string;
  analyzingStats: string;
  oops: string;
  errorMessage: string;
  tryAgain: string;

  // Footer
  madeWith: string;
  creatorName: string;
  notAffiliated: string;
  shareOnSocial: string;

  // Share
  shareTitle: string;
  shareText: string;
  copyLink: string;
  copied: string;

  // Flavor texts by genre
  flavorTexts: Record<string, string>;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Hero Search
    discoverYourMusicLegend: "Discover Your Music Legend",
    title: "Deezer Legends",
    subtitle: "Search for any Deezer user and generate their unique holographic trading card",
    searchPlaceholder: "Enter a Deezer username...",
    searchHint: "Try searching for your PUBLIC Deezer name or username",
    viewCard: "View Card",

    // Card
    hp: "HP",
    weakness: "Weakness",
    resistance: "Resistance",
    retreat: "Retreat",
    deezerLegends: "DEEZER LEGENDS",

    // Rarity
    legendary: "LEGENDARY",
    ultraRare: "ULTRA RARE",
    rare: "RARE",
    uncommon: "UNCOMMON",
    common: "COMMON",

    // Buttons
    downloadCard: "Download Card",
    shareCard: "Share",
    searchAnother: "Search Another",
    newSearch: "New Search",
    generating: "Generating...",
    downloaded: "Downloaded!",

    // Loading & Error
    generatingCard: "Generating Legend Card...",
    analyzingStats: "Analyzing music stats and creating your card",
    oops: "Oops! Something went wrong",
    errorMessage: "We couldn't generate the Legend Card. Please try again.",
    tryAgain: "Try Again",

    // Footer
    madeWith: "Made with 💜 by",
    creatorName: "Maxime Mansiet",
    notAffiliated: "Not affiliated with Deezer",
    shareOnSocial: "Share your Legend Card on social media! 🎵",

    // Share
    shareTitle: "Check out my Deezer Legend Card!",
    shareText: "I just created my music trading card on Deezer Legends! Create yours now:",
    copyLink: "Copy Link",
    copied: "Copied!",

    // Flavor texts
    flavorTexts: {
      Pop: "A rising star known for catchy melodies and chart-topping hits.",
      Rock: "A legendary force wielding the power of distorted guitars.",
      "Hip-Hop": "Spitting bars with unmatched flow and rhythm.",
      Rap: "Commanding the mic with lyrical precision.",
      Electronic: "Channeling pure energy through synthesized beats.",
      Jazz: "A master of improvisation and soulful expression.",
      Classical: "Conducting symphonies of unparalleled beauty.",
      Metal: "Unleashing chaos with crushing riffs and thunderous drums.",
      "R&B": "Smooth vocals that move hearts and souls.",
      Indie: "An authentic voice from the underground scene.",
      default: "A unique talent with an eclectic taste in music.",
    },
  },
  fr: {
    // Hero Search
    discoverYourMusicLegend: "Découvrez Votre Légende Musicale",
    title: "Deezer Legends",
    subtitle:
      "Recherchez n'importe quel utilisateur Deezer et générez sa carte holographique unique",
    searchPlaceholder: "Entrez un nom d'utilisateur Deezer...",
    searchHint: "Essayez de rechercher votre nom ou pseudo Deezer PUBLIC",
    viewCard: "Voir la Carte",

    // Card
    hp: "PV",
    weakness: "Faiblesse",
    resistance: "Résistance",
    retreat: "Retraite",
    deezerLegends: "DEEZER LEGENDS",

    // Rarity
    legendary: "LÉGENDAIRE",
    ultraRare: "ULTRA RARE",
    rare: "RARE",
    uncommon: "PEU COMMUN",
    common: "COMMUN",

    // Buttons
    downloadCard: "Télécharger",
    shareCard: "Partager",
    searchAnother: "Nouvelle Recherche",
    newSearch: "Retour",
    generating: "Génération...",
    downloaded: "Téléchargé !",

    // Loading & Error
    generatingCard: "Génération de la Carte Légende...",
    analyzingStats: "Analyse des stats musicales et création de votre carte",
    oops: "Oups ! Une erreur s'est produite",
    errorMessage: "Impossible de générer la Carte Légende. Veuillez réessayer.",
    tryAgain: "Réessayer",

    // Footer
    madeWith: "Fait avec 💜 par",
    creatorName: "Maxime Mansiet",
    notAffiliated: "Non affilié à Deezer",
    shareOnSocial: "Partagez votre Carte Légende sur les réseaux ! 🎵",

    // Share
    shareTitle: "Découvrez ma Carte Deezer Legend !",
    shareText: "Je viens de créer ma carte musicale sur Deezer Legends ! Créez la vôtre :",
    copyLink: "Copier le lien",
    copied: "Copié !",

    // Flavor texts
    flavorTexts: {
      Pop: "Une étoile montante connue pour ses mélodies accrocheuses.",
      Rock: "Une force légendaire maniant la puissance des guitares saturées.",
      "Hip-Hop": "Crache des rimes avec un flow et un rythme inégalés.",
      Rap: "Maîtrise le micro avec une précision lyrique.",
      Electronic: "Canalise l'énergie pure à travers des beats synthétiques.",
      Jazz: "Un maître de l'improvisation et de l'expression soulful.",
      Classical: "Dirige des symphonies d'une beauté incomparable.",
      Metal: "Déchaîne le chaos avec des riffs écrasants.",
      "R&B": "Des voix suaves qui touchent les cœurs et les âmes.",
      Indie: "Une voix authentique de la scène underground.",
      default: "Un talent unique avec un goût éclectique pour la musique.",
    },
  },
};

/**
 * Get translation for a specific key
 */
export function t(lang: Language, key: keyof Translations): string | Record<string, string> {
  return translations[lang][key];
}
