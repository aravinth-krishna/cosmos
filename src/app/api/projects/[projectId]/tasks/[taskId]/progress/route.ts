// src/app/api/projects/[projectId]/tasks/[taskId]/progress/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path
// Placeholder for authentication
const getLoggedInUserId = () => "user-uuid-placeholder"; // Replace with actual auth

interface Params {
  projectId?: string;
  taskId?: string;
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const { projectId, taskId } = params;
  if (!projectId || !taskId) {
    return new NextResponse("Project ID and Task ID are required", {
      status: 400,
    });
  }

  try {
    const userId = getLoggedInUserId(); // Authenticate
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectTeam = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } }, // Any team member can update progress
    });
    const isAssignee = await prisma.task
      .findUnique({ where: { id: taskId } })
      .then((task) => task?.assigneeId === userId);

    if (!projectTeam && !isAssignee) {
      // Assignee or any team member can update
      return new NextResponse("Unauthorized to update task progress", {
        status: 403,
      });
    }

    const body = await req.json();
    const { status } = body;

    if (
      !status ||
      ![
        "TODO",
        "IN_PROGRESS",
        "REVIEW",
        "COMPLETED",
        "ON_HOLD",
        "CANCELLED",
      ].includes(status)
    ) {
      return new NextResponse("Invalid task status provided", { status: 400 });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId, projectId: projectId },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: { assignee: true },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task progress:", error);
    return NextResponse.json(
      { message: "Failed to update task progress" },
      { status: 500 }
    );
  }
}
