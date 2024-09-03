import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ticketId = params.id;

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const ticketWithUserInfo = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      userName: ticket.user.name,
      userImage: ticket.user.image
    };

    return NextResponse.json({ ticket: ticketWithUserInfo });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ticketId = params.id;
  const body = await req.json();

  try {
    const existingTicket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!existingTicket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const isAdmin = session.user.isAdmin;
    const isOwner = existingTicket.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Unauthorized to edit this ticket' }, { status: 403 });
    }

    if (existingTicket.status === 'CLOSED' && !isAdmin) {
      return NextResponse.json({ error: 'Cannot edit closed tickets' }, { status: 403 });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    const ticketWithUserInfo = {
      id: updatedTicket.id,
      title: updatedTicket.title,
      description: updatedTicket.description,
      status: updatedTicket.status,
      userName: updatedTicket.user.name,
      userImage: updatedTicket.user.image
    };

    return NextResponse.json({ message: 'Ticket updated successfully', ticket: ticketWithUserInfo });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}