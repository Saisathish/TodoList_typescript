import React, { useState, useRef, useEffect } from "react";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import { Draggable } from "react-beautiful-dnd";
import { MdDone, MdClose } from "react-icons/md";
import { Todo } from "../model";
import "./styles.css";

type Props = {
  index: number;
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  droppedList: Todo[];
  setDroppedList: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const SingleTodo: React.FC<Props> = ({
  index,
  todo,
  todos,
  setTodos,
  droppedList,
  setDroppedList,
}) => {
  const [edit, setedit] = useState<boolean>(false);
  const [editTodos, seteditTodos] = useState<string>(todo.todo);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDone(id: number) {
    setTodos(
      todos.filter((todo) => {
        if (todo.id === id) {
          let tempArr = droppedList;
          tempArr.push({ ...todo, isDone: !todo.isDone });
          setDroppedList(tempArr);
          return false;
        }
        return true;
      })
    );
  }

  function handleDelete(id: number) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleEdit(e: React.FormEvent, id: number) {
    e.preventDefault();
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, todo: editTodos };
        }
        return todo;
      })
    );
    setedit(false);
  }

  useEffect(() => {
    inputRef.current?.focus();
  });

  return (
    <Draggable draggableId={todo.id.toString()} index={index}>
      {(provided, snapshot) => (
        <form
          className={`todos__single ${snapshot.isDragging ? "drag" : ""}`}
          onSubmit={(e) => handleEdit(e, todo.id)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {edit ? (
            <input
              ref={inputRef}
              type="text"
              value={editTodos}
              onChange={(e) => {
                seteditTodos(e.target.value);
              }}
              className="todos__single--text"
            />
          ) : todo.isDone ? (
            <s className="todos__single--text"> {todo.todo} </s>
          ) : (
            <span className="todos__single--text"> {todo.todo} </span>
          )}

          <div>
            <span
              className="icon"
              onClick={() => {
                if (!edit && !todo.isDone) {
                  setedit(!edit);
                }
              }}
            >
              <AiFillEdit />
            </span>
            <span className="icon" onClick={() => handleDelete(todo.id)}>
              <AiFillDelete />
            </span>
            <span className="icon" onClick={() => handleDone(todo.id)}>
              {todo.isDone ? <MdClose /> : <MdDone />}
            </span>
          </div>
        </form>
      )}
    </Draggable>
  );
};

export default SingleTodo;
