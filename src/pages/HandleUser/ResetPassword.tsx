/*imports react */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/*imports MUI */
import {
  Box,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

/*imports CSS */
import "../styles/alert.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports Libs */
import { ToastContainer, toast } from "react-toastify";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

/*imports extras */
import { api } from "../../api/api";
import { ButtonDefault } from "../../components/Button";
import { Head } from "../partials/Head";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import { HeaderDefault } from "../partials/HeaderDefault";
import React from "react";
import { Spinner } from "../../components/Spinner";

/*interface*/

interface IResertPassword {
  email: string;
}

/* validação formulario */
const validationRegistrerUser = yup.object().shape({
  email: yup
    .string()
    .required("O email é obrigatório")
    .email("Digite um email válido"),
});

export function ResetPassword() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const token = getTokenLocalStorage();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IResertPassword>({
    resolver: yupResolver(validationRegistrerUser),
  });

  const recoverPassword = (data: IResertPassword) =>
    api
      .post("/users/recoverPassword", data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      })
      .catch((err) => {
        const message =
          err.response.data.message || err.response.data.errors[0].msg;

        switch (err.response.status) {
          case 401:
            toast.error(message + "\n Redirecionando para login...");
            setTimeout(() => {
              navigate("/login");
            }, 4000);
            break;
          default:
            toast.error(message);
        }
      });

  return (
    <>
      <Head title="Rede Unisoft - Reset de Senha" />
      <HeaderDefault />
      <ToastContainer />
      <div className="container-fluid mt-5 mx-auto">
        <Paper
          sx={{
            p: 2,
            margin: "auto",
            flexGrow: 1,
            maxWidth: 550,
          }}
        >
          <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
            <i className="fa fa-refresh fa-2x" aria-hidden="true"></i> Recuperar
            senha
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
            Uma senha provisória será enviada em seu email, use ela para acessar
            o sistema! <br />
            Quando acessar o sistema, você será redirecionado para trocar a
            senha!
          </Typography>
          <Box
            onSubmit={handleSubmit(recoverPassword)}
            component="form"
            sx={{ flexGrow: 1 }}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="d-flex flex-column gap-1">
                  <TextField
                    id="email"
                    {...register("email")}
                    label="Email"
                    size="small"
                    fullWidth
                    placeholder="usuario@dominio.com"
                    variant="outlined"
                  />
                  <p className="error-message">{errors.email?.message}</p>
                </div>
              </Grid>
            </Grid>
            <ButtonDefault
              link="/login"
              contentBtnPrimary={isLoading ? <Spinner /> : "Recuperar senha"}
              contentBtnSecondary="Cancelar"
            />
          </Box>
        </Paper>
      </div>
    </>
  );
}
