import React from "react";

function About() {
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
        src="https://oncubanews.com/wp-content/uploads/2018/05/cosmos-13.jpg"
        style={{
          minWidth: "100%",
          minHeight: "100%",

          top: 0,
          left: 0,
        }}
      />
      <div
        style={{
          top: "50%",
          left: "50%",
          position: "absolute",
          transform: `translate(-50%, -50%)`,
          alignItems: "center",
          color: "white",
        }}
      >
        <h3> Mi experiencia con Programación Web</h3>
        <ul>
          <li>
            React.js. He desarrollado una aplicación de administración de
            comercio electrónico.
          </li>
          <li>TypeScript. </li>
          <li>
            JavaScript. He desarrollado aplicaciónes móviles tanto como webs
            utilizando TS y JS.
          </li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Wordpress</li>
        </ul>
        <h3>Proyectos Personales</h3>
        <ul>
          <li>
            <a href="wwww.tencargo.net">Tencargo: Compra y Vende en Grande</a>
          </li>
          <li>
            {" "}
            <a href="https://play.google.com/store/apps/dev?id=9163813336455724440&hl=es_419">
              Desarrollo Móvil
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default About;
