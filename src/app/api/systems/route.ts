import { NextResponse } from 'next/server';
import { fetchSystems, updateSystemStatus } from '@/lib/api/systems';

export async function GET() {
  try {
    const systems = await fetchSystems();
    return NextResponse.json(systems);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching systems' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const { id, status } = await request.json();
  try {
    const system = await updateSystemStatus(id, status);
    return NextResponse.json(system);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating system status' }, { status: 500 });
  }
}
