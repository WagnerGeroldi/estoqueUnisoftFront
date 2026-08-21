/*imports react */
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";
/*imports styles CSS */
import "react-toastify/dist/ReactToastify.css";
import "../styles/ConfigPage.scss";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button } from "@mui/material";
import { Head } from "../partials/Head";
import ClearIcon from "@mui/icons-material/Clear";
const FilterComponent = ({ filterText, onFilter, onClear }: any) => (
  <>
    <div className="d-flex  ">
      <input
        id="search"
        type="text"
        placeholder="Pesquisar..."
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <Button variant="contained" id="button" type="button" onClick={onClear}>
        <ClearIcon />
      </Button>
    </div>
  </>
);

export function CertificadosEntregues(this: any) {
  const [loading, setLoading] = useState(true);
  const [certificados, setCertificados] = useState([]);
  const [countCertificados, setCountCertificados] = useState("");

  

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get(`/certificados/findAllEntregue`)
      .then((res) => {
        setCertificados(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    api
      .get(`/certificados/countEntregue`)
      .then((res) => {
        setCountCertificados(res.data);
      })
      .catch((err) => {
        toast.error(
          err.response.data.message);
      });
  }, []);


  /*lidar com filtro da lista */
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = certificados.filter(
    (item: any) =>
      item.nome && item.nome.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e: any) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  /*fim lidar com filtro da lista */

  /*criando colunas datatable */

  const columns = [
    {
      name: "Nome",
      selector: (row: any) => row.nome,
      sortable: true,
    },
    {
      name: "Curso",
      selector: (row: any) => row.curso,
      sortable: true,
    },
    {
      name: "Período",
      selector: (row: any) => row.periodo,
      sortable: true,
    },
    {
      name: "Cidade",
      selector: (row: any) => row.cidade,
      sortable: true,
    },
    {
      name: "Data da Entrega",
      selector: (row: any) => HandleOnlyDate(new Date(row.data_entrega)),
      sortable: true,
    },
    
  ];

  return (
    <>
      <Head title="Rede Unisoft - Certificados Entregues" />
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
          <div className="d-flex flex-wrap justify-content-between gap-2">
            <div>
              <strong>{`Total de Certificados: ${countCertificados}`}</strong>
            </div>
            <div>
              <Link to="/certificateList" className="btn btn-success">
                  Certificados Entregues
                </Link>
            </div>
          </div>
          <div className="info-user">
            <h1> Certificados Entregues </h1>
          </div>

          {loading === true ? (
            <p className="loading">Carregando informações...</p>
          ) : (
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle}
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              dense
            />
          )}
        </Paper>
      </div>
    </>
  );
}
