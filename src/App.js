import React, { useState } from "react";
import "./App.css";
import Detail from "./Components/Detail";
import Home from "./Components/Home";
import Products from "./Components/Products";

function App() {

  const [products, setProducts] = useState([
    { id: 1, name: "Thanh", age: 18 },
    { id: 2, name: "Tuệ", age: 20 },
    { id: 3, name: "Đạt", age: 25 }
  ]);


  const [names, setNames] = useState([]);

  const addName = (name) => {
    setNames([...names, name]);
  };

  const removeName = (index) => {
    setNames(names.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách</h2>
      {products.map((item) => (
        <Detail
          key={item.id}
          id={item.id}
          name={item.name}
          price={item.price}
        />
      ))}

      <hr />

      
      <h2>Quản lý danh sách tên</h2>
      <Home onAdd={addName} />
      <Products names={names} onRemove={removeName} />
    </div>
  );
}

export default App;
