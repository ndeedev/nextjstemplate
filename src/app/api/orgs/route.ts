import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const OrgSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = OrgSchema.parse(body);

    const org = await prisma.organization.create({
      data: {
        name,
        users: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json(org, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const orgs = await prisma.organization.findMany({
    where: { users: { some: { id: session.user.id } } },
  });

  return NextResponse.json(orgs);
}