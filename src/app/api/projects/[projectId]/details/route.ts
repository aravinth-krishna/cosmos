// src/app/api/projects/[projectId]/details/route.ts
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
      return new NextResponse("Unauthorized to access project details", {
        status: 403,
      }); // User must be team member
    }

    const projectDetails = await prisma.projectDetail.findUnique({
      where: { projectId: projectId },
    });

    if (!projectDetails) {
      return new NextResponse("Project details not found", { status: 404 }); // Handle case where details are not yet created
    }

    return NextResponse.json(projectDetails);
  } catch (error) {
    console.error("Error fetching project details:", error);
    return NextResponse.json(
      { message: "Failed to fetch project details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  // Or PUT - depends if you want to replace or partially update
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
      where: {
        projectId_userId: { projectId: projectId, userId: userId },
        role: { in: ["ADMIN"] },
      }, // Only admins can update details
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === userId);

    if (!projectTeam && !isCreator) {
      return new NextResponse("Unauthorized to update project details", {
        status: 403,
      }); // Only admins or creator
    }

    const body = await req.json();
    const { links, notes, otherDetails } = body;

    const updatedDetails = await prisma.projectDetail.upsert({
      // Use upsert to create if not exists, update if exists
      where: { projectId: projectId },
      update: {
        links: links,
        notes: notes,
        otherDetails: otherDetails,
      },
      create: {
        projectId: projectId,
        links: links,
        notes: notes,
        otherDetails: otherDetails,
      },
    });

    return NextResponse.json(updatedDetails);
  } catch (error) {
    console.error("Error updating project details:", error);
    return NextResponse.json(
      { message: "Failed to update project details" },
      { status: 500 }
    );
  }
}
