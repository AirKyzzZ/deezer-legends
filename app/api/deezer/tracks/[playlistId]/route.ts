import { NextRequest, NextResponse } from "next/server";

const DEEZER_API_BASE = "https://api.deezer.com";

interface RouteParams {
  params: Promise<{ playlistId: string }>;
}

/**
 * GET /api/deezer/tracks/[playlistId]
 * Fetches tracks from a specific playlist
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { playlistId } = await params;

  if (!playlistId || isNaN(Number(playlistId))) {
    return NextResponse.json(
      { error: "Valid playlist ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${DEEZER_API_BASE}/playlist/${playlistId}/tracks?limit=5`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!response.ok) {
      throw new Error(`Deezer API responded with ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Failed to fetch tracks" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracks" },
      { status: 500 }
    );
  }
}

