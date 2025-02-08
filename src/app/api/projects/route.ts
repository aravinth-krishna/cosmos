// src/app/api/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust path to your Prisma client
// Placeholder for authentication - replace with your actual auth logic
const getLoggedInUserId = () => "user-uuid-placeholder"; // Replace with actual auth

export async function GET() {
  try {
    const userId = getLoggedInUserId(); // Authenticate and get user ID (replace placeholder)
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { teamMembers: { some: { userId: userId } } }, // Projects user is a team member of
          { createdBy: userId }, // Projects created by the user
        ],
      },
      include: {
        teamMembers: {
          include: { user: true },
        },
        tasks: true,
        details: true,
        timeline: true,
        chatMessages: true,
      },
    });

    const projectsWithCalculatedData = projects.map((project) => {
      const teamMemberIds = project.teamMembers.map((pt) => pt.userId);
      const completedTasksCount = project.tasks.filter(
        (task) => task.status === "COMPLETED"
      ).length;
      const totalTasksCount = project.tasks.length;
      const progress =
        totalTasksCount > 0
          ? Math.round((completedTasksCount / totalTasksCount) * 100)
          : 0;
      let status = "To Do";
      if (progress > 0 && progress < 100) {
        status = "In Progress";
      } else if (progress === 100) {
        status = "Completed";
      }

      return {
        ...project, // Include all existing project data
        teamMembers: teamMemberIds,
        progress: progress,
        status: status,
        startDate: project.startDate?.toISOString() || null,
        endDate: project.endDate?.toISOString() || null,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
      };
    });

    return NextResponse.json(projectsWithCalculatedData);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { message: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const userId = getLoggedInUserId(); // Authenticate and get user ID (replace placeholder)
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, description, startDate, endDate } = body;

    if (!name) {
      return new NextResponse("Project name is required", { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdBy: userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Failed to create project" },
      { status: 500 }
    );
  }
}
