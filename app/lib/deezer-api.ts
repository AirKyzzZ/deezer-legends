/**
 * Deezer API Client
 * Fetches data through Next.js API routes to avoid CORS issues
 */

import type {
  DeezerUser,
  DeezerUserFull,
  DeezerSearchResponse,
  DeezerPlaylistsResponse,
  DeezerTracksResponse,
  UserStats,
  LegendCardData,
  TCGCardData,
  ElementData,
  ElementType,
  Attack,
} from "@/app/types/deezer";

const API_BASE = "/api/deezer";

// ============================================
// GENRE TO ELEMENT MAPPING (RPG Logic)
// ============================================

const ELEMENT_DATA: Record<string, ElementData> = {
  Pop: {
    element: "Fairy",
    icon: "Sparkles",
    color: "#ff69b4",
    weakness: "Steel",
    resistance: "Dark",
  },
  Rock: {
    element: "Steel",
    icon: "Shield",
    color: "#b8b8d0",
    weakness: "Fire",
    resistance: "Fairy",
  },
  "Rap": {
    element: "Fire",
    icon: "Flame",
    color: "#ff6b35",
    weakness: "Water",
    resistance: "Steel",
  },
  "Hip-Hop": {
    element: "Fire",
    icon: "Flame",
    color: "#ff6b35",
    weakness: "Water",
    resistance: "Steel",
  },
  Electronic: {
    element: "Electric",
    icon: "Zap",
    color: "#ffd700",
    weakness: "Earth",
    resistance: "Steel",
  },
  Jazz: {
    element: "Psychic",
    icon: "Eye",
    color: "#9b59b6",
    weakness: "Dark",
    resistance: "Fire",
  },
  Classical: {
    element: "Psychic",
    icon: "Eye",
    color: "#9b59b6",
    weakness: "Dark",
    resistance: "Fire",
  },
  Metal: {
    element: "Dark",
    icon: "Moon",
    color: "#2c3e50",
    weakness: "Fairy",
    resistance: "Psychic",
  },
  "R&B": {
    element: "Water",
    icon: "Droplets",
    color: "#3498db",
    weakness: "Electric",
    resistance: "Fire",
  },
  Indie: {
    element: "Earth",
    icon: "Mountain",
    color: "#8b4513",
    weakness: "Water",
    resistance: "Electric",
  },
};

const DEFAULT_ELEMENT: ElementData = {
  element: "Normal",
  icon: "Music",
  color: "#a0a0a0",
  weakness: "Steel",
  resistance: "Normal",
};

// Genre-based fallback attacks when no tracks are available
const GENRE_ATTACKS: Record<string, Attack[]> = {
  Pop: [
    { name: "Chart Topper", damage: 40, energyCost: 2, description: "A catchy hit that stuns opponents" },
    { name: "Viral Hook", damage: 70, energyCost: 3, description: "An irresistible melody" },
  ],
  Rock: [
    { name: "Guitar Solo", damage: 50, energyCost: 2, description: "Shredding riffs deal damage" },
    { name: "Power Chord", damage: 80, energyCost: 3, description: "A thunderous strike" },
  ],
  "Hip-Hop": [
    { name: "Mic Drop", damage: 60, energyCost: 2, description: "Devastating bars" },
    { name: "Flow State", damage: 90, energyCost: 4, description: "Unstoppable rhythm" },
  ],
  Rap: [
    { name: "Mic Drop", damage: 60, energyCost: 2, description: "Devastating bars" },
    { name: "Flow State", damage: 90, energyCost: 4, description: "Unstoppable rhythm" },
  ],
  Electronic: [
    { name: "Bass Drop", damage: 55, energyCost: 2, description: "The beat hits hard" },
    { name: "Synth Wave", damage: 85, energyCost: 3, description: "Electrifying pulses" },
  ],
  Jazz: [
    { name: "Improvisation", damage: 45, energyCost: 2, description: "Unpredictable melodies" },
    { name: "Soul Serenade", damage: 75, energyCost: 3, description: "Moves the spirit" },
  ],
  Classical: [
    { name: "Symphony Strike", damage: 50, energyCost: 2, description: "Orchestral power" },
    { name: "Crescendo", damage: 100, energyCost: 4, description: "Building to a climax" },
  ],
  Metal: [
    { name: "Mosh Pit", damage: 65, energyCost: 2, description: "Chaos unleashed" },
    { name: "Headbanger", damage: 95, energyCost: 4, description: "Brutal assault" },
  ],
  "R&B": [
    { name: "Smooth Groove", damage: 40, energyCost: 1, description: "Silky smooth vibes" },
    { name: "Soul Power", damage: 70, energyCost: 3, description: "Deep emotional impact" },
  ],
  Indie: [
    { name: "Underground Hit", damage: 45, energyCost: 2, description: "Hidden gem attack" },
    { name: "Authentic Sound", damage: 75, energyCost: 3, description: "Raw and real" },
  ],
};

const DEFAULT_ATTACKS: Attack[] = [
  { name: "Melody Strike", damage: 30, energyCost: 1, description: "A basic musical attack" },
  { name: "Rhythm Blast", damage: 60, energyCost: 2, description: "Powerful beat combo" },
];

// ============================================
// API Functions
// ============================================

/**
 * Search for Deezer users by query
 */
export async function searchUsers(
  query: string
): Promise<DeezerSearchResponse<DeezerUser>> {
  if (!query.trim()) {
    return { data: [], total: 0 };
  }

  const response = await fetch(
    `${API_BASE}/search?q=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Failed to search users");
  }

  return response.json();
}

/**
 * Get full user details by ID
 */
export async function getUser(userId: number): Promise<DeezerUserFull> {
  const response = await fetch(`${API_BASE}/user/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

/**
 * Get user's playlists
 */
export async function getUserPlaylists(
  userId: number
): Promise<DeezerPlaylistsResponse> {
  const response = await fetch(`${API_BASE}/playlists/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  return response.json();
}

/**
 * Get tracks from a playlist
 */
export async function getPlaylistTracks(
  playlistId: number
): Promise<DeezerTracksResponse> {
  const response = await fetch(`${API_BASE}/tracks/${playlistId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tracks");
  }

  return response.json();
}

/**
 * Get element data based on genre
 */
function getElementFromGenre(genre: string): ElementData {
  return ELEMENT_DATA[genre] || DEFAULT_ELEMENT;
}

/**
 * Generate attacks from tracks or fallback to genre-based attacks
 */
async function generateAttacks(
  playlists: DeezerPlaylistsResponse,
  genre: string
): Promise<Attack[]> {
  const playlistData = playlists.data || [];
  
  // Find a public playlist with tracks
  const publicPlaylist = playlistData.find(
    (p) => p.public && p.nb_tracks > 0 && !p.is_loved_track
  );

  if (publicPlaylist) {
    try {
      const tracksResponse = await getPlaylistTracks(publicPlaylist.id);
      const tracks = tracksResponse.data || [];

      if (tracks.length >= 2) {
        // Convert top 2 tracks to attacks
        return tracks.slice(0, 2).map((track, index) => {
          // Calculate damage based on track rank (0-1000000)
          const baseDamage = Math.floor((track.rank || 500000) / 10000);
          const damage = Math.min(120, Math.max(20, baseDamage + (index === 0 ? 20 : 40)));
          
          return {
            name: track.title_short || track.title,
            damage,
            energyCost: index === 0 ? 2 : 3,
            description: `by ${track.artist?.name || "Unknown Artist"}`,
          };
        });
      }
    } catch (error) {
      console.error("Failed to fetch tracks, using fallback attacks:", error);
    }
  }

  // Fallback to genre-based attacks
  return GENRE_ATTACKS[genre] || DEFAULT_ATTACKS;
}

/**
 * Calculate HP based on user activity
 */
function calculateHP(user: DeezerUserFull, totalTracks: number): number {
  const baseHP = 60;
  const fanBonus = Math.min(60, (user.nb_fan || 0) * 2);
  const playlistBonus = Math.min(40, (user.nb_playlist || 0) * 5);
  const trackBonus = Math.min(40, Math.floor(totalTracks / 10));
  
  return Math.min(250, baseHP + fanBonus + playlistBonus + trackBonus);
}

/**
 * Calculate retreat cost based on playlist count
 */
function calculateRetreatCost(playlistCount: number): number {
  if (playlistCount >= 20) return 3;
  if (playlistCount >= 10) return 2;
  return 1;
}

/**
 * Determine rarity based on activity
 */
function determineRarity(hp: number, totalTracks: number): string {
  const score = hp + totalTracks;
  if (score >= 400) return "LEGENDARY";
  if (score >= 250) return "ULTRA RARE";
  if (score >= 150) return "RARE";
  if (score >= 80) return "UNCOMMON";
  return "COMMON";
}

/**
 * Generate flavor text based on genre and stats
 */
function generateFlavorText(genre: string, user: DeezerUserFull): string {
  const flavorTexts: Record<string, string> = {
    Pop: `A rising star from ${user.country || "the music world"}, known for catchy melodies.`,
    Rock: `A legendary force wielding the power of distorted guitars.`,
    "Hip-Hop": `Spitting bars with unmatched flow and rhythm.`,
    Rap: `Commanding the mic with lyrical precision.`,
    Electronic: `Channeling pure energy through synthesized beats.`,
    Jazz: `A master of improvisation and soulful expression.`,
    Classical: `Conducting symphonies of unparalleled beauty.`,
    Metal: `Unleashing chaos with crushing riffs and thunderous drums.`,
    "R&B": `Smooth vocals that move hearts and souls.`,
    Indie: `An authentic voice from the underground scene.`,
  };

  return flavorTexts[genre] || `A unique talent from ${user.country || "around the world"}.`;
}

/**
 * Calculate user stats from their data (legacy support)
 */
function calculateStats(
  user: DeezerUserFull,
  playlists: DeezerPlaylistsResponse
): UserStats {
  const playlistData = playlists.data || [];
  const totalTracks = playlistData.reduce((sum, p) => sum + (p.nb_tracks || 0), 0);
  const totalFans = playlistData.reduce((sum, p) => sum + (p.fans || 0), 0);

  const userPlaylists = user.nb_playlist || 0;
  const userFans = user.nb_fan || 0;
  
  const powerLevel = Math.min(
    9999,
    Math.floor(
      userPlaylists * 10 +
        userFans * 5 +
        totalTracks * 2 +
        totalFans * 3
    )
  );

  let legendRank: string;
  if (powerLevel >= 5000) {
    legendRank = "MYTHIC";
  } else if (powerLevel >= 2500) {
    legendRank = "LEGENDARY";
  } else if (powerLevel >= 1000) {
    legendRank = "EPIC";
  } else if (powerLevel >= 500) {
    legendRank = "RARE";
  } else {
    legendRank = "COMMON";
  }

  const genres = Object.keys(ELEMENT_DATA);
  const topGenre = genres[Math.floor(Math.random() * genres.length)];

  return {
    totalPlaylists: userPlaylists,
    totalFans: userFans,
    totalTracks,
    topGenre,
    legendRank,
    powerLevel,
  };
}

/**
 * Build TCG card data
 */
async function buildTCGCardData(
  user: DeezerUserFull,
  playlists: DeezerPlaylistsResponse,
  genre: string,
  totalTracks: number
): Promise<TCGCardData> {
  const element = getElementFromGenre(genre);
  const attacks = await generateAttacks(playlists, genre);
  const hp = calculateHP(user, totalTracks);
  const retreatCost = calculateRetreatCost(user.nb_playlist || 0);
  const rarity = determineRarity(hp, totalTracks);
  const flavorText = generateFlavorText(genre, user);

  return {
    user,
    hp,
    element,
    attacks,
    retreatCost,
    rarity,
    flavorText,
  };
}

/**
 * Fetch complete legend card data for a user
 */
export async function getLegendCardData(
  userId: number
): Promise<LegendCardData> {
  const [user, playlists] = await Promise.all([
    getUser(userId),
    getUserPlaylists(userId),
  ]);

  const stats = calculateStats(user, playlists);
  const tcg = await buildTCGCardData(user, playlists, stats.topGenre, stats.totalTracks);

  return { user, stats, tcg };
}

/**
 * Export element data for use in components
 */
export { ELEMENT_DATA, DEFAULT_ELEMENT };
