/**
 * Deezer API Client
 */

import type {
  DeezerUser,
  DeezerUserFull,
  DeezerSearchResponse,
  DeezerPlaylistsResponse,
  DeezerTracksResponse,
  DeezerTrack,
  UserStats,
  LegendCardData,
  TCGCardData,
  ElementData,
  GenreType,
  Attack,
} from "@/app/types/deezer";

const API_BASE = "/api/deezer";

// ============================================
// GENRE DATA - Using real genre names as types
// ============================================

const GENRE_DATA: Record<string, ElementData> = {
  Pop: {
    genre: "Pop",
    icon: "Sparkles",
    color: "#ff69b4",
    weakness: "Metal",
    resistance: "Rap",
  },
  Rock: {
    genre: "Rock",
    icon: "Guitar",
    color: "#e74c3c",
    weakness: "Electronic",
    resistance: "Pop",
  },
  Rap: {
    genre: "Rap",
    icon: "Mic",
    color: "#ff6b35",
    weakness: "Rock",
    resistance: "Electronic",
  },
  "Hip-Hop": {
    genre: "Hip-Hop",
    icon: "Mic",
    color: "#ff6b35",
    weakness: "Rock",
    resistance: "Electronic",
  },
  Electronic: {
    genre: "Electronic",
    icon: "Zap",
    color: "#00d4ff",
    weakness: "Jazz",
    resistance: "Rock",
  },
  Jazz: {
    genre: "Jazz",
    icon: "Piano",
    color: "#9b59b6",
    weakness: "Metal",
    resistance: "Electronic",
  },
  Classical: {
    genre: "Classical",
    icon: "Music",
    color: "#c9a227",
    weakness: "Rap",
    resistance: "Jazz",
  },
  Metal: {
    genre: "Metal",
    icon: "Skull",
    color: "#2c3e50",
    weakness: "Classical",
    resistance: "Rock",
  },
  "R&B": {
    genre: "R&B",
    icon: "Heart",
    color: "#e91e63",
    weakness: "Electronic",
    resistance: "Pop",
  },
  Indie: {
    genre: "Indie",
    icon: "Leaf",
    color: "#27ae60",
    weakness: "Pop",
    resistance: "Metal",
  },
};

const DEFAULT_GENRE: ElementData = {
  genre: "Mixed",
  icon: "Music",
  color: "#a236ff",
  weakness: "Mixed",
  resistance: "Mixed",
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
 * Get genre data based on genre name
 */
function getGenreData(genre: string): ElementData {
  return GENRE_DATA[genre] || DEFAULT_GENRE;
}

/**
 * Extract top 2 artists from tracks
 */
function extractTopArtists(tracks: DeezerTrack[]): Attack[] {
  // Count artist occurrences and get their best track
  const artistMap = new Map<string, { count: number; track: DeezerTrack }>();

  for (const track of tracks) {
    const artistName = track.artist?.name;
    if (!artistName) continue;

    const existing = artistMap.get(artistName);
    if (existing) {
      existing.count++;
      // Keep the higher-ranked track
      if ((track.rank || 0) > (existing.track.rank || 0)) {
        existing.track = track;
      }
    } else {
      artistMap.set(artistName, { count: 1, track });
    }
  }

  // Sort by count (most listened artists first)
  const sortedArtists = Array.from(artistMap.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 2);

  // Convert to attacks
  return sortedArtists.map(([artistName, data], index) => {
    const baseDamage = Math.floor((data.track.rank || 500000) / 10000);
    const damage = Math.min(120, Math.max(30, baseDamage + data.count * 5 + (index === 0 ? 10 : 0)));

    return {
      name: artistName,
      damage,
      energyCost: index === 0 ? 2 : 3,
      description: data.track.title_short || data.track.title,
    };
  });
}

/**
 * Generate attacks from user's top artists
 */
async function generateAttacks(
  playlists: DeezerPlaylistsResponse,
  genre: string
): Promise<Attack[]> {
  const playlistData = playlists.data || [];
  const allTracks: DeezerTrack[] = [];

  // Collect tracks from multiple playlists to get better artist data
  const publicPlaylists = playlistData
    .filter((p) => p.public && p.nb_tracks > 0 && !p.is_loved_track)
    .slice(0, 3); // Check up to 3 playlists

  for (const playlist of publicPlaylists) {
    try {
      const tracksResponse = await getPlaylistTracks(playlist.id);
      if (tracksResponse.data) {
        allTracks.push(...tracksResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch tracks from playlist:", error);
    }
  }

  if (allTracks.length >= 2) {
    const topArtists = extractTopArtists(allTracks);
    if (topArtists.length >= 2) {
      return topArtists;
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
      userPlaylists * 10 + userFans * 5 + totalTracks * 2 + totalFans * 3
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

  const genres = Object.keys(GENRE_DATA);
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
  const element = getGenreData(genre);
  const attacks = await generateAttacks(playlists, genre);
  const hp = calculateHP(user, totalTracks);
  const retreatCost = calculateRetreatCost(user.nb_playlist || 0);
  const rarity = determineRarity(hp, totalTracks);

  return {
    user,
    hp,
    element,
    attacks,
    retreatCost,
    rarity,
    genre,
  };
}

/**
 * Fetch complete legend card data for a user
 */
export async function getLegendCardData(userId: number): Promise<LegendCardData> {
  const [user, playlists] = await Promise.all([
    getUser(userId),
    getUserPlaylists(userId),
  ]);

  const stats = calculateStats(user, playlists);
  const tcg = await buildTCGCardData(
    user,
    playlists,
    stats.topGenre,
    stats.totalTracks
  );

  return { user, stats, tcg };
}

/**
 * Export genre data for use in components
 */
export { GENRE_DATA, DEFAULT_GENRE };
