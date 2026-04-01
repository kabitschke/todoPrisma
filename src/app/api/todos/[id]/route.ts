import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const body = await req.json()

  // const updatedTodo = await prisma.todo.update({
  //   where: {
  //     id: Number(id)
  //   },
  //   data: {
  //     title: body.title,
  //     completed: body.completed
  //   }
  // })

  const updatedTodo = await prisma.todo.update({
    where: {
      id: Number(id)
    },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.completed !== undefined && { completed: body.completed })
    }
  })

  return Response.json(updatedTodo)
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  await prisma.todo.delete({
    where: {
      id: Number(id)
    }
  })

  return Response.json({ ok: true })
}