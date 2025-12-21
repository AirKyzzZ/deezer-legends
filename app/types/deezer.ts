/**
 * Deezer API Type Definitions
 */

export interface DeezerUser {
  id: number;
  name: string;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  country: string;
  tracklist: string;
  type: "user";
}

export interface DeezerUserFull extends DeezerUser {
  nb_album: number;
  nb_fan: number;
  nb_playlist: number;
}

export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  time_add: number;
  artist: {
    id: number;
    name: string;
    link: string;
    tracklist: string;
    type: string;
  };
  album: {
    id: number;
    title: string;
    cover: string;
    cover_small: string;
    cover_medium: string;
    cover_big: string;
    cover_xl: string;
    md5_image: string;
    tracklist: string;
    type: string;
  };
  type: "track";
}

export interface DeezerPlaylist {
  id: number;
  title: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  md5_image: string;
  picture_type: string;
  time_add: number;
  time_mod: number;
  creator: {
    id: number;
    name: string;
    tracklist: string;
    type: string;
  };
  type: "playlist";
}

export interface DeezerSearchResponse<T> {
  data: T[];
  total: number;
  next?: string;
}

export interface DeezerPlaylistsResponse {
  data: DeezerPlaylist[];
  checksum: string;
  total: number;
  next?: string;
}

export interface DeezerTracksResponse {
  data: DeezerTrack[];
  checksum?: string;
  total: number;
  next?: string;
}

// ============================================
// TCG Card Types - Using real genre names
// ============================================

export type GenreType =
  | "Pop"
  | "Rock"
  | "Rap"
  | "Hip-Hop"
  | "Electronic"
  | "Jazz"
  | "Classical"
  | "Metal"
  | "R&B"
  | "Indie"
  | "Mixed";

export interface ElementData {
  genre: GenreType;
  icon: string; // Lucide icon name
  color: string;
  weakness: GenreType;
  resistance: GenreType;
}

export interface Attack {
  name: string; // Artist name
  damage: number;
  energyCost: number;
  description?: string; // Track name
}

export interface TCGCardData {
  user: DeezerUserFull;
  hp: number;
  element: ElementData;
  attacks: Attack[];
  retreatCost: number;
  rarity: string;
  genre: string;
}

// Legacy types (kept for backward compatibility)
export interface UserStats {
  totalPlaylists: number;
  totalFans: number;
  totalTracks: number;
  topGenre: string;
  legendRank: string;
  powerLevel: number;
}

export interface LegendCardData {
  user: DeezerUserFull;
  stats: UserStats;
  tcg: TCGCardData;
}
