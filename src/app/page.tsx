"use client"

import { useState } from "react";

export default function Home() {

  type Todo = {
    label: string;
    checked: boolean;
  }


  const [texto, setTexto] = useState('');
  const [list, setList] = useState<Todo[]>([]);
  const [indice, setIndice] = useState<number | null>(null);



  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
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
  }


  const handleAdd = () => {

    if (texto.trim() === '') return;



    if (indice !== null) {
      const up = list.map((el, key) => (
        key === indice ? { ...el, label: texto, checked: false } : el)
      );



      setList(up);
      setTexto('');
      setIndice(null);
    } else {
      setList([...list, { label: texto, checked: false }]);
      setTexto('');

    }


  }

  const handleDell = (index: number) => {

    if (confirm('Deseja excluir?') === true) {

      const up = list.filter((el, key) => key !== index);
      setList(up);
    }

  }

  const handleAlter = (index: number) => {
    setIndice(index);
    setTexto(list[index].label);

  }


  const toggleItem = (index: number) => {

    for (let i in list) {
      if (list[index] === list[i]) {
        list[index].checked = !list[index].checked
      }
    }

    setList([...list]);

  }


  return (
    <div className="w-screen h-screen bg-[#222] flex flex-col items-center">
      <div className="max-w-3xl w-full bg-[#333] flex items-center justify-center mt-8 p-8 rounded-md">

        <input type="text "
          className="p-2 rounded-md mr-4 flex-1 border border-gray-400"
          placeholder="O que deseja fazer?"
          value={texto}
          onKeyDown={handleEnter}
          onChange={e => setTexto(e.target.value)}

        />

        <button className="bg-[#222] hover:bg-[#111] text-white px-4 py-2 rounded-md"
          onClick={handleAddTodo}
        >{`${indice !== null ? 'Editar' : 'Adicionar'}`}</button>
      </div>

      <div className="max-w-3xl w-full mt-4">
        {
          list.map((el, key) =>
            <div key={key} className="text-white flex justify-between items-center bg-[#333] mt-4 rounded-md">
              <div className={`mt-4 ml-2 ${el.checked === true ? 'line-through' : ''}`}>
                <input type="checkbox" checked={el.checked} className="w-4 h-4" onChange={() => toggleItem(key)} /> {el.label}</div>

              <div className="">
                <span className="p-2 bg-yellow-600 rounded-md cursor-pointer mr-2"
                  onClick={() => handleAlter(key)}>Alterar</span>

                <span className="p-2 bg-red-600 rounded-md cursor-pointer mr-2"
                  onClick={() => handleDell(key)}>Deletar</span>

              </div>

            </div>
          )
        }
      </div>
    </div>
  );
}
