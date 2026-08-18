/*imports CSS */
import React from "react";
import "./HeaderDefault.scss";

export function HeaderDefault() {
  return (
    <>
      <header className="header-initial">
        <div className="d-flex gap-1 flex-wrap justify-content-center">
          <span className="color-c">Controle de Estoque</span>
          <span className="text"> Rede Unisoft</span>
        </div>
      </header>
    </>
  );
}
