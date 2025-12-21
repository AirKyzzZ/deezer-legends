import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/deezer/image?url={encodedUrl}
 * Proxies image requests to bypass CORS restrictions
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return NextResponse.json(
      { error: "Image URL is required" },
      { status: 400 }
    );
  }

  try {
    // Validate the URL is from Deezer CDN
    const url = new URL(imageUrl);
    const allowedHosts = [
      "e-cdns-images.dzcdn.net",
      "cdns-images.dzcdn.net",
      "cdn-images.dzcdn.net",
      "api.deezer.com",
    ];

    if (!allowedHosts.some((host) => url.hostname.includes(host))) {
      return NextResponse.json(
        { error: "Invalid image source" },
        { status: 403 }
      );
    }

    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Error proxying image:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    );
  }
}

