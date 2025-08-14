import React from "react";

export default function Product({ names, onRemove }) {
  return (
    <ul>
      {names.map((n, index) => (
        <li key={index}>
          {n}{" "}
          <button
            onClick={() => onRemove(index)}
            style={{ color: "red", marginLeft: "8px" }}
          >
            Xóa
          </button>
        </li>
      ))}
    </ul>
  );
}
