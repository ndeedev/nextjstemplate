import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const SettingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  theme: z.enum(['light', 'dark']),
  language: z.string().min(1),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { notificationsEnabled, theme, language } = SettingsSchema.parse(body);

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: { notificationsEnabled, theme, language },
      create: {
        userId: session.user.id,
        notificationsEnabled,
        theme,
        language,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }
}