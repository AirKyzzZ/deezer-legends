/**
 * Deezer API Type Definitions
 * Based on the Deezer Public API documentation
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
}

