import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would come from your database
let tasks = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const task = tasks.find(t => t.id === params.id);
  
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const taskIndex = tasks.findIndex(t => t.id === params.id);
    
    if (taskIndex === -1) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    tasks[taskIndex] = updatedTask;

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskIndex = tasks.findIndex(t => t.id === params.id);
  
  if (taskIndex === -1) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  tasks.splice(taskIndex, 1);

  return NextResponse.json({ message: 'Task deleted successfully' });
}
