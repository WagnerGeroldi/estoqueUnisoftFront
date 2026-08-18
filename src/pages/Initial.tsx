import { Link } from "react-router-dom";

/*imports MUI */
import "./Initial.css";
import Button from "@mui/material/Button";
import { Head } from "./partials/Head";
import imageLogin from "../assets/images/organize_resume.svg";
import imageLoginRight from "../assets/images/login.svg";

import { getUserLocalStorage } from "../state/SaveLocalStorage";
import React from "react";

export function Initial() {
  const userStorage = getUserLocalStorage();

  return (
    <>
      <Head title="Rede Unisoft - Controle de Estoque" />
      <div className="content-container">
        <div className="left-board bg-light ">
          <div className="mt-4 d-flex flex-column justify-content-center mx-auto">
            <div className="mt-4 d-flex flex-column justify-content-center mx-auto">
              <h2>Área de Login</h2>
              <h3>Controle de Estoque Unisoft</h3>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <img src={imageLogin} alt="" width="80%" />
          </div>
        </div>
        <div className="right-board bg-info">
          <div className="mt-4 d-flex flex-column justify-content-center">
            <div className=" d-flex justify-content-center mb-5 ">
              <img
                src={imageLoginRight}
                alt=""
                width="50%"
                className="image-info"
              />
            </div>
            {!userStorage ? (
              <div className="d-flex gap-3 flex-column justify-content-center mx-auto align-items-center">
                <div className="d-flex justify-content-center">
                  <Link to="/login">
                    <Button
                      className="mb-5 btn-default"
                      variant="contained"
                      color="primary"
                    >
                      Clique para fazer login
                    </Button>
                  </Link>
                </div>
                <Link to="/register">
                  <Button
                    className="btn-default"
                    variant="contained"
                    color="primary"
                  >
                    Crie sua conta e começe agora
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="d-flex gap-3 flex-column justify-content-center mx-auto">
                <div className="d-flex justify-content-center">
                  <Link to={`/dashboard/${userStorage.id}`}>
                    <Button variant="contained" color="primary" type="submit">
                      {`Continuar como ${userStorage.name}`}
                    </Button>
                  </Link>
                </div>
                <Link to="/login">
                  <Button color="primary">
                    {`Não é ${userStorage.name} cique aqui e faça login`}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
