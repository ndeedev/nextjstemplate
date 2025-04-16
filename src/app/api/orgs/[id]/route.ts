import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const org = await prisma.organization.findFirst({
      where: {
        id: params.id,
        users: { some: { id: session.user.id } },
      },
      include: {
        roles: true,
      },
    });

    if (!org) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 });
    }

    return NextResponse.json(org);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}