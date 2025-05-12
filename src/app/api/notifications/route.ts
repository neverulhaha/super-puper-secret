import { NextResponse } from 'next/server';
import { fetchNotifications, deleteNotification } from '@/lib/api/notifications';

export async function GET() {
  try {
    const notifications = await fetchNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  try {
    const notification = await deleteNotification(id);
    return NextResponse.json(notification);
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting notification' }, { status: 500 });
  }
}
