import { NextRequest, NextResponse } from 'next/server';
import { prisma, getPaginationParams, buildSearchQuery, handleDatabaseError } from '@/lib/database';
import { z } from 'zod';

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(255, 'Project name too long'),
  description: z.string().optional(),
  status: z.enum(['active', 'on-hold', 'completed', 'cancelled']).default('active'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.string().datetime().optional().transform(str => str ? new Date(str) : undefined),
});

const updateProjectSchema = createProjectSchema.partial();

const querySchema = z.object({
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  sortBy: z.string().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// GET /api/projects - Get all projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = Object.fromEntries(searchParams.entries());
    const validation = querySchema.safeParse(query);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { page, limit, search, status, priority, sortBy, sortOrder } = validation.data;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    // Build where clause
    const where: any = { userId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    // Get pagination params
    const paginationParams = getPaginationParams({
      page,
      limit,
      orderBy: sortBy,
      orderDirection: sortOrder,
    });

    // Get projects with pagination
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        ...paginationParams,
        include: {
          tasks: {
            select: {
              id: true,
              status: true,
            },
          },
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    // Calculate task counts by status
    const projectsWithTaskCounts = projects.map(project => ({
      ...project,
      taskCounts: {
        total: project._count.tasks,
        todo: project.tasks.filter(task => task.status === 'todo').length,
        inProgress: project.tasks.filter(task => task.status === 'in-progress').length,
        review: project.tasks.filter(task => task.status === 'review').length,
        done: project.tasks.filter(task => task.status === 'done').length,
      },
    }));

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: projectsWithTaskCounts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Get projects error:', error);
    const dbError = handleDatabaseError(error);
    return NextResponse.json(
      { error: dbError.message },
      { status: dbError.statusCode }
    );
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createProjectSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const projectData = validation.data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        taskCounts: {
          total: 0,
          todo: 0,
          inProgress: 0,
          review: 0,
          done: 0,
        },
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Create project error:', error);
    const dbError = handleDatabaseError(error);
    return NextResponse.json(
      { error: dbError.message },
      { status: dbError.statusCode }
    );
  }
}