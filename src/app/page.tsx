"use client"

import { useState, useEffect } from "react";

type TodoDB = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
}

export default function Home() {

  const [texto, setTexto] = useState('');
  const [todos, setTodos] = useState<TodoDB[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [isSaving, setIsSaving] = useState(false)

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  function startEdit(todo: TodoDB) {
    setTexto(todo.title)  // 🔥 joga no input principal
    setEditId(todo.id)    // 🔥 define que está editando
  }

  async function toggleTodo(todo: TodoDB) {
    await fetch(`/api/todos/${todo.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        completed: !todo.completed // 🔥 inverte valor
      })
    })

    loadTodos()
  }

  async function handleDelete(id: number) {
    const confirmDelete = confirm('Tem certeza que deseja excluir?')

    if (!confirmDelete) return

    await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })

    loadTodos()
  }


  async function saveEdit() {
    if (!editText || isSaving) return

    setIsSaving(true)

    await fetch(`/api/todos/${editId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: editText
      })
    })

    setEditId(null)
    setEditText('')
    setIsSaving(false)
    loadTodos()
  }

  function handleEditEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      saveEdit()
    }
  }

  async function handleAddOrEdit() {
    if (!texto) return

    // 🔥 EDITANDO
    if (editId) {
      await fetch(`/api/todos/${editId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: texto
        })
      })

      setEditId(null) // sai do modo edição
    }
    // 🔥 ADICIONANDO
    else {
      await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: texto
        })
      })
    }

    setTexto('')
    loadTodos()
  }

  async function handleAddTodo() {
    if (!texto) return

    await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: texto
      })
    })

    setTexto('')
    loadTodos()
  }

  async function loadTodos() {
    const res = await fetch('/api/todos')
    const data = await res.json()
    setTodos(data)
  }

  useEffect(() => {
    loadTodos()
  }, [])

  return (
    <div className="w-screen h-screen bg-[#222] flex flex-col items-center">

      <div className="max-w-3xl w-full bg-[#333] flex items-center justify-center mt-8 p-8 rounded-md">
        <input
          type="text"
          className="p-2 text-white rounded-md mr-4 flex-1 border border-gray-400"
          placeholder="O que deseja fazer?"
          value={texto}
          onKeyDown={handleEnter}
          onBlur={saveEdit}
          autoFocus
          onChange={e => setTexto(e.target.value)}
        />

        <button
          className="bg-[#222] hover:bg-[#111] text-white px-4 py-2 rounded-md cursor-pointer"
          onClick={handleAddOrEdit}
        >
          {`${editId ? 'Editar' : 'Adicionar'}`}
        </button>
      </div>

      <div className="max-w-3xl w-full mt-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="text-white flex justify-between  items-center bg-[#333] mt-4 p-4 rounded-md"
          >
            {/* {editId === todo.id ? (
              <input
                className="bg-[#222] text-white p-1 rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleEditEnter}
                autoFocus
              />
            ) : ( */}
            <span
              // onClick={() => startEdit(todo)}
              className={todo.completed ? 'line-through opacity-50' : ''}
            >
              {todo.title}
            </span>
            {/* )} */}

            <div className="flex gap-2">

              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
                readOnly
                className="cursor-pointer"
              />

              <button
                onClick={() => startEdit(todo)}
                className="cursor-pointer"
              >
                ✏️
              </button>

              <button
                onClick={() => handleDelete(todo.id)}
                className="cursor-pointer"
              >
                ❌
              </button>




            </div>



          </div>
        ))}
      </div>
    </div>
  );
}