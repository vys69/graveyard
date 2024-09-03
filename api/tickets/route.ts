import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, userId } = body;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        userId,
      },
    });

    return NextResponse.json({ message: 'Ticket created successfully', ticket });
  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId },
    });

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error('Error retrieving tickets:', error);
    return NextResponse.json({ error: 'Failed to retrieve tickets' }, { status: 500 });
  }
}