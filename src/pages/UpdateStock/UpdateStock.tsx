/* Imports REACT */
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

/* Imports MUI */
import {
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";

/* Imports CSS */
import "../styles/alert.scss";
import "./UpdateStock.scss";
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import {
  getTokenLocalStorage,
  getUserLocalStorage,
} from "../../state/SaveLocalStorage";

/*import de componentes */
import { ModalCancelSale } from "../../components/Modals/ModalCancelSale";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { ModalClearList } from "../../components/Modals/ModalClearList";
import { Header } from "../partials/Header";
import { Head } from "../partials/Head";

/* Validações */
const validationRegistrerUser = yup.object().shape({
  product: yup.object().required("O produto é obrigatório"),
  quantity: yup.string().required("A quantidade é obrigatória"),
});

interface IForm {
  product?: object;
  quantity?: number;
}

export function UpdateStock() {
  let navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const user = getUserLocalStorage();
  const token = getTokenLocalStorage();
  const [products, setProducts] = useState([] as any);
  const [order, setOrder] = useState([] as any);
  const [captureIdItem, setCaptureIdItem] = useState();
  const [open, setOpen] = useState(false);
  const [openModalClearList, setOpenModalClearList] = useState(false);
  const [openModalRegisterOutOfStock, setOpenModalRegisterOutOfStock] =
    useState(false);
  const [openModalCancelSale, setOpenModalCancelSale] = useState(false);

  const handleClose = () => setOpen(false);
  const handleCloseModalClearList = () => setOpenModalClearList(false);
  const handleCloseModalCancelSale = () => setOpenModalCancelSale(false);
  const handleCloseModalRegisterOutOfStock = () =>
    setOpenModalRegisterOutOfStock(false);

  const handleClickOpen = (id: any) => {
    setCaptureIdItem(id);
    setOpen(true);
  };

  const handleClickOpenModalClearList = () => {
    setOpenModalClearList(true);
  };

  const handleClickOpenModalCancelSale = () => {
    setOpenModalCancelSale(true);
  };

  const handleClickOpenModalRegisterOutOfStock = () => {
    setOpenModalRegisterOutOfStock(true);
  };

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IForm>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */

  useEffect(() => {
    api
      .get("/products/" + user.id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setProducts(res.data);
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
      .get(`/orderIncrement/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setOrder(res.data);
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

  const registerOutOfStock = () => {
    api
      .post(`/updateStock/${id}`, order, user.id)
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/dashboard/" + user.id);
        }, 1400);
      })
      .catch((error) => {
        const message =
          error.response.data.message || error.response.data.errors[0].msg;
        toast.error(message);
      });
  };

  const addItem = (data: any) =>
    api
      .post(
        `/orderIncrement/${user.id}`,
        { quantity: data.quantity, product: data.product.value },
        {
          headers: {
            "x-access-token": token,
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        setOrder(response.data.allOrder);
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

  async function clearList(user_ID: any) {
    await api
      .delete("orderIncrement/clearList/" + user_ID, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        setOrder([]);
      })
      .catch((error) => {
        switch (error.response.status) {
          case 404:
            toast.error(error.response.data.message);
            break;
          default:
            toast.error("Houve um erro, tente novamente");
        }
      });

    handleCloseModalClearList();
  }

  async function deleteItem(id: string) {
    await api
      .delete("orderIncrement/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        const newOrders = order.filter((item: any) => item.id !== id);
        setOrder(newOrders);
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

    handleClose();
  }

  const options = products.map((product: any) => ({
    value: product,
    label: product.name,
  }));

  console.log(order);

  return (
    <>
      <Head title="Rede Unisoft - Entrada de Estoque" />
      <Header />
      <div className="d-flex justify-content-center align-items-start mx-auto m-3 gap-3 flex-wrap p-3">
        <Card sx={{ maxWidth: 1100 }}>
          <ToastContainer />
          <CardContent className="h-100">
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-arrow-circle-up fa-2x" aria-hidden="true"></i>{" "}
              Entrada de produtos no estoque
            </Typography>
            <div className="d-flex gap-5 p-3 align-items-center justify-content-between">
              <p>
                Informe os produtos que necessita atualizar e dar entrada no
                estoque. <br />
                Sempre que a atualizar por aqui, será possível consultar
                futuramente!
              </p>
            </div>
            <Box
              onSubmit={handleSubmit(addItem)}
              component="form"
              sx={{ flexGrow: 1 }}
              noValidate
              autoComplete="off"
              className="card-adjust"
            >
              <Grid container spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                  <Controller
                    name="product"
                    control={control}
                    render={({ field }) => (
                      <Select
                        ref={field.ref}
                        onChange={field.onChange}
                        options={options}
                        isSearchable
                        placeholder={"Escolha..."}
                        autoFocus
                        noOptionsMessage={() => "Não Achei nada... :("}
                      />
                    )}
                  />

                  <p className="error-message">{errors.product?.message}</p>
                </Grid>
                <Grid item lg={3} md={3} xs={12}>
                  <TextField
                    id="quantity"
                    {...register("quantity")}
                    name="quantity"
                    label="Quantidade"
                    size="small"
                    fullWidth
                    type="number"
                    placeholder="1"
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <p className="error-message">{errors.quantity?.message}</p>
                </Grid>
                <Grid item lg={3} md={3} xs={12}>
                  <Button variant="contained" type="submit">
                    Adicionar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
        <Card className="overflow-auto" sx={{ maxWidth: 875 }}>
          <CardContent>
            <Typography sx={{ fontSize: 16 }} color="text.primary" gutterBottom>
              <i className="fa fa-info " aria-hidden="true"></i> Resumo
            </Typography>
            <table className="table table-striped">
              <thead>
                <tr>
                  <td scope="col">Produto</td>
                  <td scope="col">Quantidade</td>
                  <td scope="col">Categoria</td>
                  <td scope="col">Excluir</td>
                </tr>
              </thead>
              <tbody>
                {order.map((item: any) => (
                  <tr key={item.id}>
                    <td>{item.product}</td>
                    <td>{item.quantity}</td>
                    <td>{item.category}</td>
                    <td>
                      <DeleteIcon
                        className="icon-delete"
                        onClick={() => handleClickOpen(item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Box
              component="form"
              sx={{ flexGrow: 1 }}
              noValidate
              autoComplete="off"
            >
              <Grid container spacing={2}></Grid>
              <div className="d-flex align-items-center gap-2 flex-wrap justify-content-center mt-3">
                {order.length === 0 ? (
                  <div className="d-flex gap-2">Aguardando produtos....</div>
                ) : (
                  <div className="d-flex gap-2 btn-default">
                    <Button
                      onClick={() => handleClickOpenModalRegisterOutOfStock()}
                      variant="contained"
                      color="primary"
                    >
                      Atualizar Quantidades
                    </Button>
                    <Button
                      onClick={() => handleClickOpenModalCancelSale()}
                      variant="contained"
                      color="secondary"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => handleClickOpenModalClearList()}
                      variant="contained"
                      color="warning"
                    >
                      Limpar tudo
                    </Button>
                  </div>
                )}
              </div>
            </Box>
          </CardContent>
        </Card>
      </div>

      <ModalConfirm
        action={deleteItem.bind(captureIdItem!)}
        title="Deseja remover este item da lista?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Remover"
      />

      <ModalClearList
        action={clearList.bind(id)}
        title="Tem certeza que deseja Limpar a lista?"
        setOpen={openModalClearList}
        setClose={handleCloseModalClearList}
        infoOne="Limpar lista"
      />

      <ModalCancelSale
        action={clearList.bind(id)}
        title="Ao sair, sua lista será perdida, deseja continuar?"
        setOpen={openModalCancelSale}
        link={`/dashboard/${user.id}`}
        setClose={handleCloseModalCancelSale}
        infoOne="Continuar"
      />

      <ModalCancelSale
        action={registerOutOfStock}
        title="Confirmar atualização de quantidade?"
        setOpen={openModalRegisterOutOfStock}
        link={`#`}
        setClose={handleCloseModalRegisterOutOfStock}
        infoOne="Confirmar"
      />
    </>
  );
}
