/*imports react */
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { Head } from "../partials/Head";

/*imports styles CSS */
import "./ReportTotalStock.scss";
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import React from "react";
import { ReportPDFStockZero } from "./PDF/ReportPDFStockZero";

export function ReportStockZero() {
  const [products, setProducts] = useState([] as any);
  const { id } = useParams() as { id: string };
  const { quantity } = useParams() as { quantity: string };
  const token = getTokenLocalStorage();
  const navigate = useNavigate();

  /*Consultas BACKEND */

  useEffect(() => {
    api
      .get(`/products/FindStockZero/${id}/${quantity}`, {
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
      <Head title="ControlSoft - Relatório de Produtos com estoque ZERADO" />
      <Header />
      <ToastContainer />

      <div className="p-3">
        <Paper
          sx={{
            p: 2,
            margin: "auto",
            maxWidth: 1100,
            flexGrow: 1,
            marginTop: 3,
          }}
        >
          <Button
            onClick={() => ReportPDFStockZero(products)}
            variant="contained"
            color="primary"
          >
            Gerar PDF
          </Button>
          <Link to={`/report/${id}`}>
            <Button>Voltar</Button>
          </Link>
          <div className="info-user">
            <h2>Relatório de Estoque Zerado</h2>
          </div>
          <Grid container spacing={2} className="div-table">
            <Grid item xs={12}>
              {products.length === 0 ? (
                "Não existem produtos para mostrar"
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>Produto</td>
                      <td>Quantidade</td>
                      <td>Categoria</td>
                      <td>Data do Cadastro</td>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.categoryProduct}</td>
                        <td>{HandleOnlyDate(new Date(item.createdAt))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Grid>
          </Grid>
        </Paper>
      </div>
    </>
  );
}
