// src/app/api/projects/[projectId]/chat/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path
// Placeholder for authentication
const getLoggedInUserId = () => "user-uuid-placeholder"; // Replace with actual auth

interface Params {
  projectId?: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const { projectId } = params;
  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const userId = getLoggedInUserId(); // Authenticate
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectTeam = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (!projectTeam) {
      return new NextResponse("Unauthorized to access project chat", {
        status: 403,
      }); // User must be team member
    }

    const messages = await prisma.chatMessage.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "asc" }, // Or 'desc' for latest first
      include: { user: true },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json(
      { message: "Failed to fetch chat messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, { params }: { params: Params }) {
  const { projectId } = params;
  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const userId = getLoggedInUserId(); // Authenticate
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectTeam = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (!projectTeam) {
      return new NextResponse("Unauthorized to send chat messages", {
        status: 403,
      }); // User must be team member
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new NextResponse("Message text is required", { status: 400 });
    }

    const chatMessage = await prisma.chatMessage.create({
      data: {
        projectId: projectId,
        userId: userId,
        message: message,
      },
      include: { user: true },
    });

    return NextResponse.json(chatMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending chat message:", error);
    return NextResponse.json(
      { message: "Failed to send chat message" },
      { status: 500 }
    );
  }
}
