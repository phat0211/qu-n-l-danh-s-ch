import React, { useState } from "react";

export default function Home({ onAdd }) {
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim() === "") return;
    onAdd(name);
    setName("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Nhập tên..."
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd} style={{ marginLeft: "8px" }}>
        Thêm
      </button>
    </div>
  );
}
