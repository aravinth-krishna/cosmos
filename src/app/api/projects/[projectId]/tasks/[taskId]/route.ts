// src/app/api/projects/[projectId]/tasks/[taskId]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path
import { authMiddleware } from "@/lib/auth-middleware"; // Import auth middleware

interface Params {
  projectId?: string;
  taskId?: string;
}

const getLoggedInUserId = async (req: NextRequest): Promise<string | null> => {
  const authResult = await authMiddleware(req);
  return authResult.userId;
};

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { projectId, taskId } = params;
  if (!projectId || !taskId) {
    return new NextResponse("Project ID and Task ID are required", {
      status: 400,
    });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const projectTeam = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (!projectTeam) {
      return new NextResponse("Unauthorized to access project tasks", {
        status: 403,
      }); // User must be team member
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId, projectId: projectId },
      include: { assignee: true },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Error fetching task details:", error);
    return NextResponse.json(
      { message: "Failed to fetch task details" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { projectId, taskId } = params;
  if (!projectId || !taskId) {
    return new NextResponse("Project ID and Task ID are required", {
      status: 400,
    });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const projectTeam = await prisma.projectTeam.findUnique({
      where: {
        projectId_userId: { projectId: projectId, userId: userId },
        role: { in: ["ADMIN", "MEMBER"] },
      }, // Adjust roles allowed to update tasks
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === userId);
    const isAssignee = await prisma.task
      .findUnique({ where: { id: taskId } })
      .then((task) => task?.assigneeId === userId);

    if (!projectTeam && !isCreator && !isAssignee) {
      // Assignee, Admin or Creator can update
      return new NextResponse("Unauthorized to update this task", {
        status: 403,
      });
    }

    const body = await req.json();
    const {
      name,
      description,
      assigneeId,
      dueDate,
      priority,
      startDate,
      status,
    } = body;

    const updatedTask = await prisma.task.update({
      where: { id: taskId, projectId: projectId },
      data: {
        name,
        description,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
        startDate: startDate ? new Date(startDate) : undefined,
        status,
        updatedAt: new Date(),
      },
      include: { assignee: true },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { message: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { projectId, taskId } = params;
  if (!projectId || !taskId) {
    return new NextResponse("Project ID and Task ID are required", {
      status: 400,
    });
  }

  try {
    const userId = await getLoggedInUserId(req); // Authenticate using middleware
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projectTeam = await prisma.projectTeam.findUnique({
      where: {
        projectId_userId: { projectId: projectId, userId: userId },
        role: { in: ["ADMIN"] },
      }, // Adjust roles allowed to delete tasks
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === userId);

    if (!projectTeam && !isCreator) {
      // Only Admin or Creator can delete
      return new NextResponse("Unauthorized to delete this task", {
        status: 403,
      });
    }

    await prisma.task.delete({
      where: { id: taskId, projectId: projectId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
