import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would come from your database
const tasks = [
  {
    id: "1",
    title: "Design new dashboard layout",
    description: "Create wireframes and mockups for the new dashboard interface",
    status: "in-progress",
    priority: "high",
    assignee: "You",
    dueDate: "2024-01-20",
    tags: ["design", "ui", "frontend"],
    isStarred: true,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Implement authentication system",
    description: "Set up JWT authentication with refresh tokens",
    status: "todo",
    priority: "urgent",
    assignee: "You",
    dueDate: "2024-01-18",
    tags: ["backend", "auth", "security"],
    isStarred: false,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12"
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const priority = searchParams.get('priority');
  const search = searchParams.get('search');

  let filteredTasks = tasks;

  if (status) {
    filteredTasks = filteredTasks.filter(task => task.status === status);
  }

  if (priority) {
    filteredTasks = filteredTasks.filter(task => task.priority === priority);
  }

  if (search) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return NextResponse.json(filteredTasks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newTask = {
      id: Date.now().toString(),
      title: body.title || "New Task",
      description: body.description || "",
      status: body.status || "todo",
      priority: body.priority || "medium",
      assignee: body.assignee || "You",
      dueDate: body.dueDate || new Date().toISOString().split('T')[0],
      tags: body.tags || [],
      isStarred: body.isStarred || false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // In production, save to database
    tasks.push(newTask);

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
