// src/app/api/projects/[projectId]/team/route.ts
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

    const projectTeamCheck = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (!projectTeamCheck) {
      return new NextResponse("Unauthorized to access project team", {
        status: 403,
      }); // User must be team member
    }

    const teamMembers = await prisma.projectTeam.findMany({
      where: { projectId: projectId },
      include: { user: true }, // Include user details
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { message: "Failed to fetch team members" },
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
    const adminUserId = getLoggedInUserId(); // Authenticate - Admin User Adding Team Members
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
      return new NextResponse("Unauthorized to add team members", {
        status: 403,
      }); // Only Admin or Creator can add
    }

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role || !["MEMBER", "ADMIN", "VIEWER"].includes(role)) {
      return new NextResponse("Invalid user ID or team role provided", {
        status: 400,
      });
    }

    // Check if user is already in the team
    const existingTeamMember = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (existingTeamMember) {
      return new NextResponse("User is already a member of this project", {
        status: 409,
      }); // Conflict
    }

    const projectTeamMember = await prisma.projectTeam.create({
      data: {
        projectId: projectId,
        userId: userId,
        role: role,
      },
      include: { user: true },
    });

    return NextResponse.json(projectTeamMember, { status: 201 });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      { message: "Failed to add team member" },
      { status: 500 }
    );
  }
}
