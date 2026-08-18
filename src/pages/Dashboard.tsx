import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Header } from "./partials/Header";

import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../api/api";

import { Head } from "./partials/Head";
import { getTokenLocalStorage } from "../state/SaveLocalStorage";
import { Spinner } from "../components/Spinner";

export function Dashboard() {
  const { id } = useParams() as { id: string };
  const [products, setProducts] = useState([] as any);
  const token = getTokenLocalStorage();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products/countProducts/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
          setProducts(res.data)
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
      <Head title="Rede Unisoft - Dashboard" />
      <Header />
      <ToastContainer />
      <div id="home" className="container-fluid">
        <div className="row col-12 mt-4 text-center m-0">
          <p className="bg-light border border-dark p-4 fs-1">DASHBOARD</p>
        </div>
        <div className="content-dashboard">
          <div className="row bg-light border border-dark p-4 m-0 text-justify">
            Bem-vindo!
            <br />
            Este é o sistema para controle de fluxo do Estoque da Rede Unisoft.
          </div>
          <div className="d-flex mx-auto justify-content-center mt-2 gap-2 p-4 flex-wrap">
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <Link to={`/products/${id}`}>
                <Card
                  sx={{
                    maxWidth: 275,
                    minWidth: 200,
                    textAlign: "center",
                    background: "blue",
                    color: "white",
                  }}
                >
                  <CardContent>
                    <Typography sx={{ fontSize: 18 }} gutterBottom>
                      Produtos cadastrados
                    </Typography>
                    <Typography variant="h4" component="div">
                      {products.length === 0 ? <Spinner /> : products}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </div>
        </div>
      </div>
    </>
  );
}
