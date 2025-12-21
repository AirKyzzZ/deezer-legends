import { NextRequest, NextResponse } from "next/server";

const DEEZER_API_BASE = "https://api.deezer.com";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/deezer/playlists/[id]
 * Proxies user playlists requests to Deezer API
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Valid user ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${DEEZER_API_BASE}/user/${id}/playlists?limit=50`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Deezer API responded with ${response.status}`);
    }

    const data = await response.json();

    // Check for errors
    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "Failed to fetch playlists" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching Deezer playlists:", error);
    return NextResponse.json(
      { error: "Failed to fetch playlists" },
      { status: 500 }
    );
  }
}

