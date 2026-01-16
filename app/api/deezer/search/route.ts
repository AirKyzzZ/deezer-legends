import { NextRequest, NextResponse } from "next/server";

const DEEZER_API_BASE = "https://api.deezer.com";

/**
 * GET /api/deezer/search?q={query}
 * Proxies user search requests to Deezer API to avoid CORS
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    // If query is numeric, try to fetch user directly by ID first
    // This solves the issue where some users (like "Weeking") are not found in search results
    // but are accessible via direct ID lookup.
    if (/^\d+$/.test(query)) {
      try {
        const userResponse = await fetch(`${DEEZER_API_BASE}/user/${query}`, {
          headers: { Accept: "application/json" },
          next: { revalidate: 300 },
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          // Ensure it's a valid user and not an error object
          if (user && user.id && !user.error) {
            return NextResponse.json(
              { data: [user], total: 1 },
              {
                headers: {
                  "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
                },
              }
            );
          }
        }
      } catch (e) {
        // Continue to normal search if direct fetch fails
        console.warn("Direct user fetch failed, falling back to search", e);
      }
    }

    const response = await fetch(
      `${DEEZER_API_BASE}/search/user?q=${encodeURIComponent(query)}&limit=25`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Deezer API responded with ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error searching Deezer users:", error);
    return NextResponse.json({ error: "Failed to search users" }, { status: 500 });
  }
}
