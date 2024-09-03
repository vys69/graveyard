import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export async function POST(request: Request) {
  const { title, description } = await request.json();

  if (!title || !description) {
    return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
  }

  const ticketId = Date.now().toString();

  // Send message to Discord webhook
  const discordMessage = {
    content: `New Support Ticket Created`,
    embeds: [{
      title: `Ticket #${ticketId}: ${title}`,
      description: description,
      color: 5814783, // Blue color
    }],
  };

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordMessage),
    });

    if (!response.ok) {
      throw new Error('Failed to send message to Discord');
    }

    return NextResponse.json({ success: true, ticketId });
  } catch (error) {
    console.error('Error sending message to Discord:', error);
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}