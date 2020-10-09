import React from "react";

function Dashboard() {
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
        src="https://media.worldnomads.com/stories-images/tigers-nest/bhutan-hero-new.jpg"
        style={{
          minWidth: "100%",
          minHeight: "100%",

          top: 0,
          left: 0,
        }}
      />
      <h1
        style={{
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: `translate(-50%, -50%)`,
          alignItems: "center",
          color: "white",
        }}
      >
        Hola, soy Alfonso Briceño
      </h1>
    </div>
  );
}

export default Dashboard;
