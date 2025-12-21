/**
 * Deezer API Client
 * Fetches data through Next.js API routes to avoid CORS issues
 */

import type {
  DeezerUser,
  DeezerUserFull,
  DeezerSearchResponse,
  DeezerPlaylistsResponse,
  UserStats,
  LegendCardData,
} from "@/app/types/deezer";

const API_BASE = "/api/deezer";

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
 * Calculate user stats from their data
 */
function calculateStats(
  user: DeezerUserFull,
  playlists: DeezerPlaylistsResponse
): UserStats {
  const playlistData = playlists.data || [];
  const totalTracks = playlistData.reduce((sum, p) => sum + (p.nb_tracks || 0), 0);
  const totalFans = playlistData.reduce((sum, p) => sum + (p.fans || 0), 0);

  // Calculate power level based on activity
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

  // Determine legend rank based on power level
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

  // Determine top genre (mock for now since we don't have genre data from public API)
  const genres = [
    "Electronic",
    "Hip-Hop",
    "Pop",
    "Rock",
    "R&B",
    "Jazz",
    "Classical",
    "Indie",
  ];
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

  return { user, stats };
}

