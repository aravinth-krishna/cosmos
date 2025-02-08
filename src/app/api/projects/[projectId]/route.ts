// src/app/api/projects/[projectId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client
import { authMiddleware } from "@/lib/auth-middleware"; // Import your auth middleware

interface Params {
  projectId?: string;
}

const getLoggedInUserId = async (req: NextRequest): Promise<string | null> => {
  const authResult = await authMiddleware(req);
  return authResult.userId;
};

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { projectId } = params;

  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        teamMembers: { include: { user: true } },
        tasks: {
          include: { assignee: true },
        },
        details: true,
        timeline: true,
        chatMessages: {
          include: { user: true },
        },
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    } // Authorization: Check if user is a member or creator (adjust logic as needed)

    const isTeamMember = project.teamMembers.some(
      (member) => member.userId === userId
    );
    const isCreator = project.createdBy === userId;
    if (!isTeamMember && !isCreator) {
      return new NextResponse("Unauthorized to view project", { status: 403 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json(
      { message: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { projectId } = params;
  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { teamMembers: true },
    });
    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    } // Authorization: Only project admins or creator can update (adjust logic as needed)

    const isAdmin = project.teamMembers.some(
      (member) => member.userId === userId && member.role === "ADMIN"
    );
    const isCreator = project.createdBy === userId;
    if (!isAdmin && !isCreator) {
      return new NextResponse("Unauthorized to update project", {
        status: 403,
      });
    }

    const body = await req.json();
    const { name, description, startDate, endDate } = body;

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { message: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { projectId } = params;
  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { teamMembers: true },
    });
    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    } // Authorization: Only project admins or creator can delete (adjust logic as needed)

    const isAdmin = project.teamMembers.some(
      (member) => member.userId === userId && member.role === "ADMIN"
    );
    const isCreator = project.createdBy === userId;
    if (!isAdmin && !isCreator) {
      return new NextResponse("Unauthorized to delete project", {
        status: 403,
      });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return new NextResponse(null, { status: 204 }); // No content on successful deletion
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
