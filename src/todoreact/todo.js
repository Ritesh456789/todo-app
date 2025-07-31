import React, { useState, useEffect } from 'react';
import "./style.css";

// Get data from localStorage
const getLocalData = () => {
  const lists = localStorage.getItem("mytodolist");
  return lists ? JSON.parse(lists) : [];
};

const Todo = () => {
  const [inputdata, setInputData] = useState("");
  const [items, setItems] = useState(getLocalData());
  const [isEditItem, setIsEditItem] = useState(null);
  const [toggleButton, setToggleButton] = useState(false);

  const addItem = () => {
    const trimmed = inputdata.trim();
    if (!trimmed) {
      alert("Please enter a valid task.");
      return;
    }

    const isDuplicate = items.some(item => 
      item.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (toggleButton) {
      // If editing, check if the new name already exists in other items
      const duplicateEdit = items.some(item =>
        item.name.toLowerCase() === trimmed.toLowerCase() && item.id !== isEditItem
      );
      if (duplicateEdit) {
        alert("This task already exists in your list.");
        return;
      }

      setItems(items.map((curElem) => {
        if (curElem.id === isEditItem) {
          return { ...curElem, name: trimmed };
        }
        return curElem;
      }));
      setInputData("");
      setIsEditItem(null);
      setToggleButton(false);
    } else {
      if (isDuplicate) {
        alert("This task already exists in your list.");
        return;
      }

      const myNewInputData = {
        id: new Date().getTime().toString(),
        name: trimmed,
      };
      setItems([...items, myNewInputData]);
      setInputData("");
    }
  };

  const editItem = (id) => {
    const item_todo_edited = items.find((curElem) => curElem.id === id);
    setInputData(item_todo_edited.name);
    setIsEditItem(id);
    setToggleButton(true);
  };

  const deleteItem = (id) => {
    const updateItem = items.filter((curElem) => curElem.id !== id);
    setItems(updateItem);
  };

  const removeAll = () => {
    setItems([]);
  };

  useEffect(() => {
    localStorage.setItem("mytodolist", JSON.stringify(items));
  }, [items]);

  return (
    <>
      <div className="main-div">
        <div className='child-div'>
          <figure>
            <img src="./images/todo.svg" alt="todologo" />
            <figcaption>Add Your List Here 👌</figcaption>
          </figure>
          <div className='addItems'>
            <input
              type="text"
              placeholder='✍️ Add Item'
              className='form-control'
              value={inputdata}
              onChange={(event) => setInputData(event.target.value)}
            />
            {toggleButton ?
              (<i className="far fa-edit add-btn" onClick={addItem}></i>)
              : (<i className="fa fa-plus add-btn" onClick={addItem}></i>)
            }
          </div>

          <div className="showItems">
            {items.map((curElem) => {
              return (
                <div className='eachItem' key={curElem.id}>
                  <h3>{curElem.name}</h3>
                  <div className='todo-btn'>
                    <i className="far fa-edit add-btn" onClick={() => editItem(curElem.id)}></i>
                    <i className="far fa-trash-alt add-btn" onClick={() => deleteItem(curElem.id)}></i>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='showItems'>
            <button className='btn effect04' data-sm-link-text="Remove All" onClick={removeAll}>
              <span>CHECK LIST</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Todo;
