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
} from "../../state/SaveLocalStorage";
import { Head } from "../partials/Head";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { Header } from "../partials/Header";
import React from "react";
import { Spinner } from "../../components/Spinner";

/*Interface*/
interface ICategory {
  name: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
});

export function UpdateCategory() {
  const user = getUserLocalStorage();
  const token = getTokenLocalStorage();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [productData, setProductData] = useState([] as any);

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICategory>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */

  useEffect(() => {
    api
      .get(`/category/category/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        reset(res.data);
        setProductData(res.data);
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

  const updateProduct = (data: ICategory) =>
    api
      .put(`/category/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/category/" + user.id);
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
      <Head title="Rede Unisoft - Atualizar Categoria" />
      <Header />
      <div className="container-fluid mt-4 mx-auto d-flex justify-content-center">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar Categoria
            </Typography>
            <br />
            <div className="d-flex justify-content-between align-items-center p-2 gap-5">
              <p>Atualize os dados da Categoria!</p>
              <p>
                Data do cadastro:{" "}
                <strong>
                  {" "}
                  {HandleOnlyDate(new Date(productData.createdAt))}
                </strong>
              </p>
            </div>
            <Box
              onSubmit={handleSubmit(updateProduct)}
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
                      label="Nome"
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
              </Grid>
              <ButtonDefault
                link={`/category/${user.id}`}
                contentBtnPrimary={isLoading ? <Spinner /> : "Salvar"}
                contentBtnSecondary="Cancelar"
              />
            </Box>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
