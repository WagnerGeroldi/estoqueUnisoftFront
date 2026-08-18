/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";
import { ReportGeneral } from "./PDF/ReportGeneral";

import { Head } from "../partials/Head";

/*imports styles CSS */
import "../styles/ConfigPage.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import {
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import React from "react";

export function ReportPage() {
  const [products, setProducts] = useState([] as any);
  const navigate = useNavigate();
  const { id } = useParams() as { id: string };
  const token = getTokenLocalStorage();
  const [values, setValues] = useState([] as any);
  const [category, setCategory] = useState("");
  const [estoque, setEstoque] = useState("");
  const [initialDate, setInitialDate] = useState("");
  const [finalDate, setFinalDate] = useState("");
  const [initialDateUpdate, setInitialDateUpdate] = useState("");
  const [finalDateUpdate, setFinalDateUpdate] = useState("");

  function handleChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setCategory(event.target.value);
  }

  function handleChangeEstoque(event: { target: { value: React.SetStateAction<string>; }; }) {
    setEstoque(event.target.value);
  }
  
  function handleChangeInitialDate(event: { target: { value: React.SetStateAction<string>; }; }) {
    setInitialDate(event.target.value);
  }
  function handleChangeFinalDate(event: { target: { value: React.SetStateAction<string>; }; }) {
    setFinalDate(event.target.value);
  }

  function handleChangeInitialDateUpdate(event: { target: { value: React.SetStateAction<string>; }; }) {
    setInitialDateUpdate(event.target.value);
  }
  function handleChangeFinalDateUpdate(event: { target: { value: React.SetStateAction<string>; }; }) {
    setFinalDateUpdate(event.target.value);
  }

  /*Consultas BACKEND */

  useEffect(() => {
    api
      .get(`/category/${id}`, {
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

  
  

  useEffect(() => {
    api
      .get("/products/" + id, {
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

  return (
    <>
      <Head title="Rede Unisoft - Relatórios" />
      <Header />
      <ToastContainer />
      <div className="p-1">
        <Card
          sx={{
            p: 2,
            margin: "auto",
            maxWidth: 900,
            flexGrow: 1,
            marginTop: 3,
          }}
        >
          <CardContent>
            <div className="info-user ">
              <h2>Relatórios</h2>
            </div>
            <Grid container spacing={2}>
              <Grid item lg={6} xs={12}>
                <h6>
                  <strong>
                    Relatório geral do estoque <br />
                  </strong>
                </h6>
                <div className="btn-default btn-report-lg">
                  <Link to={`/reportTotalStock/${id}`}>
                    <Button
                      className="btn-default"
                      variant="contained"
                      color="success"
                    >
                      Visualizar na tela
                    </Button>
                  </Link>
                  <Button
                    onClick={() => ReportGeneral(products)}
                    variant="contained"
                    color="primary"
                  >
                    Gerar PDF
                  </Button>
                </div>
                <Link to={`/reportStockZero/${id}/0`}>
                  <Button
                    className="mt-3"
                    variant="contained"
                    color="secondary"
                  >
                    Produtos com estoque ZERADO
                  </Button>
                </Link>
                <hr />
                <h6>
                  <strong>
                    Relatório por categoria <br />
                  </strong>
                </h6>

                <TextField
  id="category"
  label="Categoria"
  size="small"
  fullWidth
  variant="outlined"
  onChange={handleChange}
  value={category} // Adicionado explicitamente para controlar o valor
  select
  InputLabelProps={{
    shrink: true,
  }}
>
  {Array.isArray(values) &&
    values.map((item: any) => (
      <MenuItem key={item.id} value={item.name}>
        {item.name}
      </MenuItem>
    ))}
</TextField>

                <Stack
                  spacing={2}
                  marginTop={2}
                  direction="row"
                  justifyContent="left"
                >
                  {category !== "" ? (
                    <Link
                      to={`/reportStockCategory/${id}/?category=${category}`}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        className="btn-default"
                      >
                        Visualizar na tela
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      className="btn-default"
                    >
                      Escolha a categoria...
                    </Button>
                  )}
                </Stack>
                <hr />
                <h6>
                  <strong>
                    Relatório por Estoque <br />
                  </strong>
                </h6>
                <TextField
                  id="estoque"
                  label="Estoque"
                  size="small"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeEstoque}
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  <MenuItem key={"CTT"} value={"CTT"}>
                      CTT
                    </MenuItem>
                    <MenuItem key={"BRM"} value={"BRM"}>
                      BRM
                    </MenuItem>
                </TextField>

                <Stack
                  spacing={2}
                  marginTop={2}
                  direction="row"
                  justifyContent="left"
                >
                  {estoque !== "" ? (
                    <Link
                      to={`/reportStockEstoque/${estoque}`}
                    >
                      <Button
                        variant="contained"
                        color="success"
                        className="btn-default"
                      >
                        Visualizar na tela
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      className="btn-default"
                    >
                      Escolha o Estoque...
                    </Button>
                  )}
                </Stack>  
                <hr />
                <h6 className="mt-4">
                  <strong>
                    Relatório de produtos Baixados <br />
                  </strong>
                </h6>
                <form
                  action={`/reportOutOfStock/?id=${id}&initialDate=${initialDate}&finalDate=${finalDate}`}
                >
                  <div className="d-flex gap-4 flex-column">
                    <TextField
                      id="dateInit"
                      label="Data Inicial"
                      size="small"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      onChange={handleChangeInitialDate}
                    />
                    <TextField
                      id="dateInit"
                      label="Data Final"
                      size="small"
                      type="date"
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      onChange={handleChangeFinalDate}
                    />
                  </div>
                  <Stack
                    spacing={2}
                    marginTop={2}
                    direction="row"
                    justifyContent="left"
                  >
                    {initialDate !== "" && finalDate !== "" ? (
                      new Date(finalDate) >= new Date(initialDate) ? (
                        <Link
                          to={`/reportOutOfStock/?id=${id}&initialDate=${initialDate}&finalDate=${finalDate}`}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            className="btn-default"
                          >
                            Visualizar na tela
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          className="btn-default"
                        >
                          Datas invertidas
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        className="btn-default"
                      >
                        Escolha as datas...
                      </Button>
                    )}
                  </Stack>
                </form>

                <hr />
                <h6 className="mt-4">
                  <strong>
                    Relatório de produtos Atualizados <br />
                  </strong>
                </h6>
                <form
                  action={`/reportUpdateOfStock/?id=${id}&initialDate=${initialDateUpdate}&finalDate=${finalDateUpdate}`}
                >
                  <div className="d-flex gap-4 flex-column">
                    <TextField
                      id="dateInit"
                      label="Data Inicial"
                      size="small"
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      onChange={handleChangeInitialDateUpdate}
                    />
                    <TextField
                      id="dateInit"
                      label="Data Final"
                      size="small"
                      type="date"
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      onChange={handleChangeFinalDateUpdate}
                    />
                  </div>
                  <Stack
                    spacing={2}
                    marginTop={2}
                    direction="row"
                    justifyContent="left"
                  >
                    {initialDateUpdate !== "" && finalDateUpdate !== "" ? (
                      new Date(finalDateUpdate) >=
                      new Date(initialDateUpdate) ? (
                        <Link
                          to={`/reportUpdateOfStock/?id=${id}&initialDate=${initialDateUpdate}&finalDate=${finalDateUpdate}`}
                        >
                          <Button
                            variant="contained"
                            color="success"
                            className="btn-default"
                          >
                            Visualizar na tela
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          className="btn-default"
                        >
                          Datas invertidas
                        </Button>
                      )
                    ) : (
                      <Button
                        variant="contained"
                        color="error"
                        className="btn-default"
                      >
                        Escolha as datas...
                      </Button>
                    )}
                  </Stack>
                </form>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
