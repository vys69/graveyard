import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  console.log('GET request received for userId:', userId);

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: userId },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    const ticketsWithUserInfo = tickets.map(ticket => ({
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      userName: ticket.user.name,
      userImage: ticket.user.image
    }));

    console.log('Fetched tickets:', ticketsWithUserInfo);
    return NextResponse.json({ tickets: ticketsWithUserInfo });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    console.log('Received POST request with body:', body);

    const ticket = await prisma.ticket.create({
      data: {
        title: body.title,
        description: body.description,
        userId: session.user.id,
        status: 'OPEN',
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      }
    });

    const ticketWithUserName = {
      id: ticket.id,
      title: ticket.title,
      status: ticket.status,
      userName: ticket.user.name
    };

    return NextResponse.json({ message: 'Ticket created successfully', ticket: ticketWithUserName });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
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

    if (ticket.userId !== session.user.id) {
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