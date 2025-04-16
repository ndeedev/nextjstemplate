import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const CommentSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  orgId: z.string().uuid().optional(),
  postId: z.string().uuid().optional(),
  parentId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { content, orgId, postId, parentId } = CommentSchema.parse(body);

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        organizationId: orgId,
        postId,
        parentId,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}