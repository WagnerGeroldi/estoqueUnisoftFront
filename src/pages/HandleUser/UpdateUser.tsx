/* Imports REACT */
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* Imports MUI */
import {
  Box,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
} from "@mui/material";


/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";


/* Imports CSS */
import "../styles/alert.scss";
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import { ButtonDefault } from "../../components/Button";
import {
  getTokenLocalStorage,
  getUserLocalStorage,
  setUserLocalStorage,
} from "../../state/SaveLocalStorage";
import { Head } from "../partials/Head";
import { Spinner } from "../../components/Spinner";

/*Interface*/
interface IUser {
  name: string;
  email: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().required("Email é obrigatório"),
});

export function UpdateUser() {

  const user = getUserLocalStorage();
  const token = getTokenLocalStorage();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [viaCep, setViaCep] = useState([] as any);
  /*funcoes*/


  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */

  useEffect(() => {
    api
      .get(`/users/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        reset(res.data);
      });
  }, []);

  const updateUser = (data: IUser) =>
    api
      .put(`/users/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        setUserLocalStorage(data);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/user/config/" + user.id);
        }, 1000);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });

  return (
    <>
      <Head
    title= "Rede Unisoft - Atualizar Usuário"
    />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar dados do Usuário
            </Typography>
            <br />
            <p>Atualize seus dados!</p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(updateUser)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>

                  <Grid item lg={6} md={6} xs={12}>
                  <div className="d-flex flex-column gap-1">
                    <TextField
                      id="name"
                      label="Nome Completo"
                      {...register("name")}
                      variant="outlined"
                      fullWidth
                      type="text"
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <p className="error-message">{errors.name?.message}</p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    
                    <TextField
                      id="email"
                      label="Email"
                      {...register("email")}
                      variant="outlined"
                      fullWidth
                      type="email"
                      disabled
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <small className="error-message">
                      O email não pode ser alterado
                    </small>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/user/config/${user.id}`}
                  contentBtnPrimary={isLoading ? <Spinner /> : "Salvar"}
                  contentBtnSecondary="Cancelar"
                />
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
