/* Imports REACT */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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

/*Import de Componentes */
import { ModalInsertCategory } from "../../components/Modals/ModalInsertCategory";
import { ModalInfo } from "../../components/Modals/ModalInfo";
import { Spinner } from "../../components/Spinner";

/*Interface*/
interface IProductRegister {
  name: string;
  fornecedor: string;
  quantity: string;
  category: string;
  estoque: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  name: yup.string().required("O nome é obrigatório"),
  fornecedor: yup.string(),
  quantity: yup.string().required("Quantidade é obrigatório"),
  category: yup.object().required("Grupo é obrigatório"),
  estoque: yup.string().required("Estoque é obrigatória"),
});

export function CreateProduct() {
  let navigate = useNavigate();
  const token = getTokenLocalStorage();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState([] as any);
  const { id } = useParams() as { id: string };
  const [open, setOpen] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const handleCloseModalInfo = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IProductRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerClient = (data: IProductRegister) =>
    api
      .post(`/products/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setIsLoading(true);
        toast.success("Produto cadastrado!");
        setTimeout(() => {
          navigate("/products/" + id);
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

  useEffect(() => {
    api
      .get(`/category/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        res.data.length === 0 ? setOpenModalInfo(true) : setValues(res.data);
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

  return (
    <>
      <Head title="Rede Unisoft - Criar Produto" />
      <Header />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>{" "}
              Cadastro de produtos
            </Typography>
            <br />
            <p>Cadastre o produto!</p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(registerClient)}
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
                        {...register("name")}
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        type="text"
                        placeholder="Exe: Coca-cola 2L"
                        size="small"
                      />
                      <p className="error-message">{errors.name?.message}</p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="fornecedor"
                        {...register("fornecedor")}
                        label="Fornecedor"
                        size="small"
                        fullWidth
                        variant="outlined"
                      />
                      <p className="error-message">
                        {errors.fornecedor?.message}
                      </p>
                    </div>
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
                        placeholder="exe: 10"
                        variant="outlined"
                      />
                      <p className="error-message">
                        {errors.quantity?.message}
                      </p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex gap-2 align-items-start">
                      <div className="d-flex flex-column gap-1 w-100">
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
                            <MenuItem key={item.id} value={item}>
                              {item.name}
                            </MenuItem>
                          ))}
                        </TextField>
                        <p className="error-message">
                          {errors.category?.message}
                        </p>
                      </div>
                      <IconButton
                        aria-label="update"
                        size="large"
                        onClick={() => handleClickOpen()}
                      >
                        <AddIcon color="primary" />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="estoque"
                        {...register("estoque")}
                        label="Estoque"
                        variant="outlined"
                        fullWidth
                        type="text"
                        placeholder="Exe: CTT"
                        size="small"
                      />
                      <p className="error-message">{errors.estoque?.message}</p>
                    </div>
                  </Grid>
                </Grid>
                <ButtonDefault
                  link={`/products/${id}`}
                  contentBtnPrimary= {isLoading ? <Spinner /> : "Cadastrar"}
                  contentBtnSecondary="Cancelar"
                />
              </Box>
            </Paper>
          </CardContent>
        </Card>

        <ModalInsertCategory
          setOpen={open}
          setClose={handleClose}
          infoOne="Excluir"
        />

        <ModalInfo
          title="Atenção"
          link={`/category/createCategory/${id}`}
          text="Sua lista de Grupo está vazia, e é obrigatório indicar uma para cadastrar o produto. Vá para a seção de Grupo e cadastre o grupo necessário para cadastrar seus produtos"
          setOpen={openModalInfo}
          setClose={handleCloseModalInfo}
          textButon="Cadastrar Grupo"
        />
      </div>
    </>
  );
}
