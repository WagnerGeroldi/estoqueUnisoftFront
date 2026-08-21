/*imports react */
import { useEffect, useMemo, useState } from "react";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";

/*imports styles CSS */
import "react-toastify/dist/ReactToastify.css";
import "../styles/ConfigPage.scss";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import { Head } from "../partials/Head";
import ClearIcon from "@mui/icons-material/Clear";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { ModalDelivered } from "../../components/Modals/ModalDelivered";
import { useNavigate } from "react-router-dom";
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

export function CertificateList(this: any) {
  const [loading, setLoading] = useState(true);
  const [certificados, setCertificados] = useState([]);
  const [countCertificados, setCountCertificados] = useState("");

  const [idProduct, setIdProduct] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  const handleClickOpen = (id: string) => {
    setIdProduct(id);
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get(`/certificados/findAll`)
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
      .get(`/certificados/count`)
      .then((res) => {
        setCountCertificados(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  async function entregarCertificado(id: string) {
    await api.get("certificados/update/" + id, {}).then((res) => {
      const message = res.data.message;
      toast.success(message);
      const newCertificados = certificados.filter(
        (certificado: any) => certificado.id !== id
      );
      setCertificados(newCertificados);
    });

    handleClose();
    location.reload();
  }

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
      cell: (row: any) => (
        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => handleClickOpen(row.id)}
        >
          <ArrowDropDownCircleIcon />
        </IconButton>
      ),
      allowOverflow: true,
      button: true,
      width: "56px",
    },
  ];

  return (
    <>
      <Head title="Rede Unisoft - Certificados não Entregues" />
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
            <div className="d-flex flex-wrap gap-2">
              <div>
                <a href="/certificadosEntregues">
                  <button className="btn btn-success">
                    {" "}
                    Certificados Entregues
                  </button>
                </a>
              </div>
              <div>
                <a href="/cadastrarCertificado">
                  <button className="btn btn-info">
                    {" "}
                    Cadastrar Certificado
                  </button>
                </a>
              </div>
            </div>
          </div>
          <div className="info-user">
            <h1> Certificados não entregues </h1>
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
        <ModalDelivered
          action={entregarCertificado.bind(this, idProduct)}
          title="Deseja marcar este certificado como entregue?"
          setOpen={open}
          setClose={handleClose}
          infoOne="Entregar"
        />
      </div>
    </>
  );
}
