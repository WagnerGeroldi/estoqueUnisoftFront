/* Imports REACT */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useState } from "react";

/* Imports MUI */
import {
  Box,
  Grid,
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
import { Header } from "../partials/Header";
import { Head } from "../partials/Head";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import { Spinner } from "../../components/Spinner";

/*Interface*/
interface ICategoryRegister {
  name: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
});

export function CreateCategory() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const token = getTokenLocalStorage();

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICategoryRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerCategory = (data: ICategoryRegister) =>
    api
      .post(`/category/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success("Categoria cadastrada!");
        setTimeout(() => {
          navigate("/category/" + id);
        }, 1000);
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
      <Head title="Rede Unisoft - Criar Categoria" />
      <Header />
      <ToastContainer />
      <div className=" mt-5 mx-auto d-flex justify-content-center m-1 ">
        <Card className="p-4" sx={{ maxWidth: 675 }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary">
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>{" "}
              Cadastro de categorias
            </Typography>
            <br />
            <p>Cadastre a categoria!</p>
            <Box
              onSubmit={handleSubmit(registerCategory)}
              component="form"
              sx={{ flexGrow: 1 }}
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={2}>
                <Grid item lg={12} md={12} xs={12}>
                  <div className="d-flex flex-column gap-1">
                    <TextField
                      id="name"
                      {...register("name")}
                      label="Nome"
                      variant="outlined"
                      fullWidth
                      type="text"
                      placeholder="Exe: Produto de Limpeza"
                      size="small"
                    />
                    <p className="error-message">{errors.name?.message}</p>
                  </div>
                </Grid>
              </Grid>
              <ButtonDefault
                link={`/category/${id}`}
                contentBtnPrimary={isLoading ? <Spinner /> : "Cadastrar"}
                contentBtnSecondary="Cancelar"
              />
            </Box>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
