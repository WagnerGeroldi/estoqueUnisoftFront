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
  MenuItem,
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
import React from "react";
import { Spinner } from "../../components/Spinner";

/*Interface*/
interface IUser {
  name: string;
  estoque: string;
  fornecedor: string;
  quantity: number;
  category: string;
  createdAt: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  estoque: yup.string().required("O Estoque é obrigatório"),
  fornecedor: yup.string(),
  quantity: yup.string().required("A quantidade é obrigatória"),
  category: yup.string().required("A categoria é obrigatória"),
});

export function UpdateProduct() {
  const token = getTokenLocalStorage();
  const user = getUserLocalStorage();
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams() as { id: string };
  const [productData, setProductData] = useState([] as any);
  const [values, setValues] = useState([] as any);

  const userID = getUserLocalStorage();

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
      .get(`/products/details/${id}`, {
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

  useEffect(() => {
    api
      .get(`/category/${userID.id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setValues(res.data);
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

  const updateProduct = (data: IUser) =>
    api
      .put(`/products/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/products/" + user.id);
        }, 1000);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        switch (error.response.status) {
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
      <Head title="Rede Unisoft - Atualizar Produto" />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-wrench fa-2x" aria-hidden="true"></i>{" "}
              Atualizar produto
            </Typography>
            <br />
            <div className="d-flex justify-content-between align-items-center p-2">
              <p>Atualize os dados do produto!</p>
              <p>
                Data do cadastro:{" "}
                <strong>
                  {" "}
                  {HandleOnlyDate(new Date(productData.createdAt))}
                </strong>
              </p>
            </div>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(updateProduct)}
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
                  <Grid item lg={6} md={6} xs={12}>
                    <TextField
                      id="fornecedor"
                      label="Descrição"
                      {...register("fornecedor")}
                      variant="outlined"
                      fullWidth
                      size="small"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="quantity"
                        {...register("quantity")}
                        label="Quantidade"
                        size="small"
                        type="number"
                        fullWidth
                        placeholder="Exe: 2"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />

                      <p className="error-message">
                        {errors.quantity?.message}
                      </p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                  <div className="d-flex flex-column gap-1">
                    <TextField
                      id="category"
                      {...register("category")}
                      label="Grupo"
                      size="small"
                      fullWidth
                      placeholder="exe: 10"
                      variant="outlined"
                      select
                      InputLabelProps={{
                        shrink: true,
                      }}
                    >
                      {values.map((item: any) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <p className="error-message">{errors.category?.message}</p>
                    </div>
                  </Grid>
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="estoque"
                        label="Estoque"
                        {...register("estoque")}
                        variant="outlined"
                        fullWidth
                        type="text"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <p className="error-message">{errors.estoque?.message}</p>
                    </div>
                  </Grid>
                <ButtonDefault
                  link={`/products/${user.id}`}
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
