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
  const [fornecedores, setFornecedores] = useState([] as any);
  const [fornecedor, setFornecedor] = useState("");

  function handleChange(event: { target: { value: React.SetStateAction<string>; }; }) {
    setCategory(event.target.value);
  }

  function handleChangeEstoque(event: { target: { value: React.SetStateAction<string>; }; }) {
    setEstoque(event.target.value);
  }

  function handleChangeFornecedor(event: { target: { value: React.SetStateAction<string>; }; }) {
    setFornecedor(event.target.value);
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
      .get(`/products/fornecedores/${id}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setFornecedores(res.data); // agora vai pra state certa
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
                    Relatório por Grupo <br />
                  </strong>
                </h6>

                <TextField
                  id="category"
                  label="Grupo"
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
                      Escolha o Grupo...
                    </Button>
                  )}
                </Stack>
                <hr />
                <h6>
                  <strong>
                    Relatório por Fornecedor <br />
                  </strong>
                </h6>

                <TextField
                  id="fornecedor"
                  label="Fornecedor"
                  size="small"
                  fullWidth
                  variant="outlined"
                  onChange={handleChangeFornecedor}
                  value={fornecedor}
                  select
                  InputLabelProps={{
                    shrink: true,
                  }}
                >
                  {Array.isArray(fornecedores) &&
                    fornecedores.map((item: any, index: number) => (
                      <MenuItem key={index} value={item.fornecedor}>
                        {item.fornecedor}
                      </MenuItem>
                    ))}
                </TextField>

                <Stack
                  spacing={2}
                  marginTop={2}
                  direction="row"
                  justifyContent="left"
                >
                  {fornecedor !== "" ? (
                    <Link
                      to={`/reportStockFornecedor/${id}/?fornecedor=${fornecedor}`}
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
                      Escolha o Fornecedor...
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

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
