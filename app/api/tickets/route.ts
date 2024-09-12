import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    const formattedTickets = tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      userName: ticket.user?.name || null,
      userImage: ticket.user?.image || null,
    }));

    return NextResponse.json({ tickets: formattedTickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.API_TOKEN}`) {
      console.log('Unauthorized: Invalid token');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received body:', body);

    const { title, description, userId, userName, userAvatar, categoryId } = body;

    if (typeof title !== 'string' || typeof description !== 'string' || typeof userId !== 'string' || typeof userName !== 'string') {
      console.log('Invalid input:', { title, description, userId, userName });
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    // Check if user exists, if not create a new user
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          name: userName,
        },
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        status: 'OPEN',
        userId,
        userName,
        userAvatar,
        categoryId,
      },
    });

    console.log('Ticket created:', ticket);
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to create ticket', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to create ticket', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const ticketId = searchParams.get('ticketId');

  if (!ticketId) {
    return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Check if the user is authorized to delete this ticket
    if (ticket.userId !== session.user.id) {
      console.log('Session user ID:', session.user.id);
      console.log('Ticket user ID:', ticket.userId);
      return NextResponse.json({ error: 'Unauthorized to delete this ticket' }, { status: 403 });
    }

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}