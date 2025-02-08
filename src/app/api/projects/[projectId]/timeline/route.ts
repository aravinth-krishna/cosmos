// src/app/api/projects/[projectId]/timeline/route.ts
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
      return new NextResponse("Unauthorized to access project timeline", {
        status: 403,
      }); // User must be team member
    }

    const projectTimeline = await prisma.projectTimeline.findUnique({
      where: { projectId: projectId },
    });

    if (!projectTimeline) {
      return new NextResponse("Project timeline data not found", {
        status: 404,
      }); // Handle case where timeline is not yet created
    }

    return NextResponse.json(projectTimeline);
  } catch (error) {
    console.error("Error fetching project timeline:", error);
    return NextResponse.json(
      { message: "Failed to fetch project timeline" },
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
        role: "ADMIN",
      }, // Only admins can update timeline data
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === userId);

    if (!projectTeam && !isCreator) {
      return new NextResponse("Unauthorized to update project timeline", {
        status: 403,
      }); // Only admins or creator can update
    }

    const body = await req.json();
    const { ganttData } = body; // Assuming you send Gantt data as JSON

    const updatedTimeline = await prisma.projectTimeline.upsert({
      // Use upsert
      where: { projectId: projectId },
      update: { ganttData: ganttData },
      create: { projectId: projectId, ganttData: ganttData },
    });

    return NextResponse.json(updatedTimeline);
  } catch (error) {
    console.error("Error updating project timeline:", error);
    return NextResponse.json(
      { message: "Failed to update project timeline" },
      { status: 500 }
    );
  }
}
