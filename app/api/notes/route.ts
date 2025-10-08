import { NextRequest, NextResponse } from 'next/server';

// Mock data - in production, this would come from your database
const notes = [
  {
    id: "1",
    title: "Project Ideas",
    content: "## New Project Ideas\n\n- Build a personal dashboard\n- Create a note-taking app\n- Develop a habit tracker\n\n## Resources\n- [React Documentation](https://react.dev)\n- [Next.js Guide](https://nextjs.org/docs)",
    tags: ["ideas", "projects", "planning"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-15",
    isStarred: true,
    links: ["#project-dashboard", "#note-taking"]
  },
  {
    id: "2",
    title: "Meeting Notes - Q1 Planning",
    content: "## Q1 Planning Meeting\n\n### Key Points\n- Review Q4 performance\n- Set Q1 goals\n- Discuss new initiatives\n\n### Action Items\n- [ ] Prepare quarterly report\n- [ ] Schedule team reviews\n- [ ] Update project timelines",
    tags: ["meeting", "planning", "work"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    isStarred: false,
    links: ["#quarterly-planning", "#team-reviews"]
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');
  const starred = searchParams.get('starred');

  let filteredNotes = notes;

  if (search) {
    filteredNotes = filteredNotes.filter(note => 
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );
  }

  if (tag) {
    filteredNotes = filteredNotes.filter(note => 
      note.tags.includes(tag)
    );
  }

  if (starred === 'true') {
    filteredNotes = filteredNotes.filter(note => note.isStarred);
  }

  return NextResponse.json(filteredNotes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newNote = {
      id: Date.now().toString(),
      title: body.title || "New Note",
      content: body.content || "Start writing...",
      tags: body.tags || [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isStarred: body.isStarred || false,
      links: body.links || []
    };

    // In production, save to database
    notes.push(newNote);

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
