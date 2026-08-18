/*imports react */
import { useParams, useSearchParams } from "react-router-dom";

/*imports extras */
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
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../api/api";
import { ReportPDFStockCategory } from "./PDF/ReportPDFStockCategory";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import { ReportPDFStockEstoque } from "./PDF/ReportPDFStockEstoque";

export function ReportStockEstoque() {
  const [productsCategory, setProductsCategory] = useState([] as any);
  const { estoque } = useParams() as { estoque: string };
  const [searchParams] = useSearchParams();
  const token = getTokenLocalStorage();
  const siglaEstoque: any = searchParams.get("estoque");

  
  useEffect(() => {
    api
      .get(`/products/findByEstoque/${estoque}`, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        
        setProductsCategory(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <>
      <Head title="Rede Unisoft - Relatório de Estoque" />
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
            onClick={(e) => ReportPDFStockEstoque(productsCategory, estoque)}
            variant="contained"
            color="primary"
          >
            Gerar PDF
          </Button>
          <Link to={`/report/${estoque}`}>
            <Button>Voltar</Button>
          </Link>
          <div className="info-user">
            <h2>{`Relatório de estoque Uni  ${estoque}`}</h2>
          </div>
          <Grid container spacing={2} className="div-table">
            <Grid item xs={12}>
              {productsCategory.length === 0 ? (
                "Não existem produtos nesta categoria..."
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <td>Produto</td>
                      <td>Quantidade</td>
                      <td>Ultima Atualização</td>
                    </tr>
                  </thead>
                  <tbody>
                    {productsCategory.map((item: any) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{HandleOnlyDate(new Date(item.updatedAt))}</td>
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
