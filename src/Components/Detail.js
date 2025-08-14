import React from "react";

function Detail(props) {
  const { id, name, price } = props;
  return (
    <div
      style={{
        border: "1px solid black",
        margin: "10px",
        padding: "10px",
        textAlign:"center"
      }}
    >
      <a>{id}</a>
      <p>{name}</p>
      <p>{price}</p>
    </div>
  );
}

export default Detail;
