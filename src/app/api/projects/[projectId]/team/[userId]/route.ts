// src/app/api/projects/[projectId]/team/[userId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path
// Placeholder for authentication
const getLoggedInUserId = () => "user-uuid-placeholder"; // Replace with actual auth

interface Params {
  projectId?: string;
  userId?: string; // User ID of team member to modify/delete
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { projectId, userId } = params;
  if (!projectId || !userId) {
    return new NextResponse("Project ID and User ID are required", {
      status: 400,
    });
  }

  try {
    const adminUserId = getLoggedInUserId(); // Authenticate - Admin User Removing Team Member
    if (!adminUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const adminProjectTeam = await prisma.projectTeam.findUnique({
      where: {
        projectId_userId: { projectId: projectId, userId: adminUserId },
        role: "ADMIN",
      },
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === adminUserId);

    if (!adminProjectTeam && !isCreator && adminUserId !== userId) {
      // Admin, Creator, or User can remove themselves
      return new NextResponse("Unauthorized to remove team member", {
        status: 403,
      }); // Only Admin or Creator can remove others
    }

    await prisma.projectTeam.delete({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      { message: "Failed to remove team member" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { projectId, userId } = params; // User ID of team member to update role
  if (!projectId || !userId) {
    return new NextResponse("Project ID and User ID are required", {
      status: 400,
    });
  }

  try {
    const adminUserId = getLoggedInUserId(); // Authenticate - Admin User Updating Role
    if (!adminUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const adminProjectTeam = await prisma.projectTeam.findUnique({
      where: {
        projectId_userId: { projectId: projectId, userId: adminUserId },
        role: "ADMIN",
      },
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === adminUserId);

    if (!adminProjectTeam && !isCreator) {
      return new NextResponse("Unauthorized to update team member role", {
        status: 403,
      }); // Only Admin or Creator can update roles
    }

    const body = await req.json();
    const { role } = body;

    if (!role || !["MEMBER", "ADMIN", "VIEWER"].includes(role)) {
      return new NextResponse("Invalid team role provided", { status: 400 });
    }

    const updatedTeamMember = await prisma.projectTeam.update({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
      data: { role: role },
      include: { user: true },
    });

    return NextResponse.json(updatedTeamMember);
  } catch (error) {
    console.error("Error updating team member role:", error);
    return NextResponse.json(
      { message: "Failed to update team member role" },
      { status: 500 }
    );
  }
}
