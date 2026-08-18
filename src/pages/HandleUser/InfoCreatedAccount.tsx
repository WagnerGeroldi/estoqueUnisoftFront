/* Imports MUI */
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

/* Imports CSS */
import "react-toastify/dist/ReactToastify.css";
import "../styles/InfoCreatedAccount.scss";

/* Imports extras */
import { ButtonUnique } from "../../components/ButtonUnique";
import { getUserLocalStorage } from "../../state/SaveLocalStorage";
import { Head } from "../partials/Head";

export function InfoCreatedAccount() {
  const user = getUserLocalStorage();

  return (
    <>
      <Head title="Rede Unisoft - Conta Criada com sucesso" />

      <div className="container">
        <Card sx={{ maxWidth: 875, margin: 5 }}>
          <CardContent>
            <p className="check">
              <i className="fa fa-check fa-5x" aria-hidden="true"></i>
            </p>
            <h2>Obrigado por criar sua conta {user.name}! </h2> <br />
            Enviamos sua senha para <strong>{user.email}</strong>
            <br />
            Verifique sua caixa de entrada! <br />
            Depois retorne aqui e clique no botão abaixo para entrar no sistema.
            <ButtonUnique link="/login" contentBtn="Ir para Login" />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
