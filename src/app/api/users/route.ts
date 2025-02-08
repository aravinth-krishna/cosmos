// src/app/api/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path
// Placeholder for authentication
const getLoggedInUserId = () => "user-uuid-placeholder"; // Replace with actual auth

export async function GET() {
  // Get current user's profile ("/api/users" is effectively "/api/users/me")
  try {
    const userId = getLoggedInUserId(); // Authenticate
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        // Select only fields you want to expose (avoid sensitive data like hashedPassword)
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return new NextResponse("User profile not found", { status: 404 }); // Should not happen if user is authenticated
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  // Update current user profile
  try {
    const userId = getLoggedInUserId(); // Authenticate
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, username, email } = body; // Allow updating these profile fields

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        username,
        email,
        updatedAt: new Date(),
      },
      select: {
        // Return selected fields after update, similar to GET
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
