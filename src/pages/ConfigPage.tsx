/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";

/*imports extras */
import { api } from "../api/api";
import { Header } from "./partials/Header";
import { ModalConfirm } from "../components/Modals/ModalConfirm";
import {
  getUserLocalStorage,
  getTokenLocalStorage,
} from "../state/SaveLocalStorage";
import { HandleDate } from "../services/HandleDate";

/*imports styles CSS */
import "./styles/ConfigPage.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { Head } from "./partials/Head";
import React from "react";

export function ConfigPage() {
  const [userInfo, setUserInfo] = useState({} as any);
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const user = getUserLocalStorage();
  const token = getTokenLocalStorage();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const textModal = `Se você confirmar esta ação, não poderá reverter depois!
  Pense bem antes de confirmar a exclusão!`;

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/users/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setUserInfo(res.data);
      })
      .catch((err) => {
        switch (err.response.status) {
          case 401:
            toast.error(
              err.response.data.message + "\n Redirecionando para login..."
            );
            setTimeout(() => {
              navigate("/login");
            }, 4000);
            break;
          default:
            toast.error(err.response.data.message);
        }
      });
  }, []);

  async function deleteUser(id: string) {
    await api
      .delete("/users/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        navigate("/");
      });
  }

  return (
    <>
      <Head title="Rede Unisoft - Configurações do Usuário" />
      <Header />
      <ToastContainer />
      <Paper
        sx={{ p: 2, margin: "auto", maxWidth: 900, flexGrow: 1, marginTop: 3 }}
      >
        <div className="info-user">
          <h1> Dados do Usuário</h1>
        </div>
        <div className=" overflow-auto mb-3">
          <table>
            <tr>
              <td className="index-info">Nome do Usuário:</td>{" "}
              <td>
                <strong>{userInfo.name}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">E-mail:</td>{" "}
              <td>
                <strong>{userInfo.email}</strong>
              </td>
            </tr>
            <tr>
              <td className="index-info">Data do cadastro:</td>{" "}
              <td>
                <strong>
                  {!userInfo.createdAt
                    ? "Não definido"
                    : HandleDate(new Date(userInfo.createdAt))}
                </strong>
              </td>
            </tr>
          </table>
        </div>
        <div className="d-flex gap-2 align-items-center justify-content-between m-2 btn-default">
          <Link to={`/user/updateUser/${id}`}>
            <Button className="bg-primary text-white">
              Atualizar dados
            </Button>
          </Link>
          <div className="d-flex gap-4 p-2 btn-default">
            <Link to={"/updatePassword"}>
              <Button className="bg-warning text-white btn-default">
                Alterar a senha
              </Button>
            </Link>
            <Button className="bg-danger text-white" onClick={handleOpen}>
              {" "}
              Excluir a conta
            </Button>
          </div>
        </div>
      </Paper>
      <ModalConfirm
        action={deleteUser.bind(user.id)}
        title="Deseja Excluir sua conta?"
        text={textModal}
        setOpen={open}
        setClose={handleClose}
        infoOne="Excluir a conta"
      />
    </>
  );
}
