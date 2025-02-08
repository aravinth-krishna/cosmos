// src/lib/auth-middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth"; // Import your verifyToken

interface JWTPayload {
  // Keep this interface as it defines the expected payload structure
  id: string;
  username: string;
  role: string;
}

export async function authMiddleware(
  req: NextRequest
): Promise<{ userId: string | null; error?: NextResponse }> {
  const token = req.headers.get("authorization")?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return {
      userId: null,
      error: NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = verifyToken(token) as JWTPayload; // Use your verifyToken and cast payload
    if (!payload || !payload.id) {
      // Basic payload validation after verifyToken
      return {
        userId: null,
        error: NextResponse.json(
          { error: "Invalid or expired token" },
          { status: 401 }
        ),
      };
    }
    return { userId: payload.id }; // Extract user ID from payload
  } catch (error) {
    console.error("Token verification failed in middleware:", error); // Log error from verifyToken
    return {
      userId: null,
      error: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}
