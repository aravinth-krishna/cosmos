// src/app/api/projects/[projectId]/tasks/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
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
    const projectTeam = await prisma.projectTeam.findUnique({
      where: { projectId_userId: { projectId: projectId, userId: userId } },
    });
    if (!projectTeam) {
      return new NextResponse("Unauthorized to access project tasks", {
        status: 403,
      }); // User must be team member
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: projectId },
      include: { assignee: true },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching project tasks:", error);
    return NextResponse.json(
      { message: "Failed to fetch project tasks" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { projectId } = params;
  if (!projectId) {
    return new NextResponse("Project ID is required", { status: 400 });
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
      }, // Adjust roles allowed to create tasks
    });
    const isCreator = await prisma.project
      .findUnique({ where: { id: projectId } })
      .then((project) => project?.createdBy === userId);
    if (!projectTeam && !isCreator) {
      return new NextResponse("Unauthorized to create tasks in this project", {
        status: 403,
      }); // Admin or Member can create
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

    if (!name) {
      return new NextResponse("Task name is required", { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        projectId: projectId,
        name,
        description,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || "MEDIUM",
        startDate: startDate ? new Date(startDate) : null,
        status: status || "TODO",
      },
      include: { assignee: true },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { message: "Failed to create task" },
      { status: 500 }
    );
  }
}
