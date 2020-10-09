import React from "react";

function Game() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <img
        src="https://i.kym-cdn.com/photos/images/newsfeed/000/284/529/e65.gif"
        style={{
          minWidth: "100%",
          minHeight: "100%",

          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}

export default Game;
