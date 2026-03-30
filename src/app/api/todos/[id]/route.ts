import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params // 🔥 AQUI ESTÁ A CORREÇÃO

  console.log('ID:', id);

  const body = await req.json()

  const updatedTodo = await prisma.todo.update({
    where: {
      id: Number(id)
    },
    data: {
      title: body.title
    }
  })

  return Response.json(updatedTodo)
}