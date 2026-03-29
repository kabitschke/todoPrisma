import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json();


  const todo = await prisma.todo.create({
    data: { title: body.title }
  })

  return NextResponse.json(todo)
}