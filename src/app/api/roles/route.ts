import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const RoleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  orgId: z.string().uuid(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, orgId } = RoleSchema.parse(body);

    const org = await prisma.organization.findFirst({
      where: { id: orgId, users: { some: { id: session.user.id } } },
    });
    if (!org) {
      return NextResponse.json({ error: 'Org not found' }, { status: 404 });
    }

    const role = await prisma.role.create({
      data: {
        name,
        organizationId: orgId,
        users: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}