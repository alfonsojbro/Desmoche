import React from "react";
import { Navbar, Nav } from "react-bootstrap";

function NavBar(props) {
  const { location } = props;

  return (
    <Navbar bg="primary" variant="dark">
      <Navbar.Brand href="/">Programación Web</Navbar.Brand>
      <Nav activeKey={location.pathname} className="mr-auto">
        <Nav.Link href="/">Inicio</Nav.Link>
        <Nav.Link href="/about">Acerca de</Nav.Link>
        <Nav.Link href="/juego">Juego</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavBar;
