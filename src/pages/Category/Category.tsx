/*imports react */
import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";
import { HandleOnlyDate } from "../../services/HandleOnlyDate";

/*imports styles CSS */
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { Head } from "../partials/Head";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import ClearIcon from "@mui/icons-material/Clear";

const FilterComponent = ({ filterText, onFilter, onClear }: any) => (
  <>
    <div className="d-flex ">
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

export function Category(this: any) {
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [idProduct, setIdProduct] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const token = getTokenLocalStorage();

  const handleClickOpen = (id: string) => {
    setIdProduct(id);
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/category/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
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

  async function deleteCategory(id: string) {
    await api
      .delete("category/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toast.success(message);
        const newProducts = products.filter(
          (product: any) => product.id !== id
        );
        setProducts(newProducts);
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

  function updateProduct(id: number) {
    navigate(`/category/updateCategory/${id}`);
  }

  /*lidar com filtro da lista */
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = products.filter(
    (item: any) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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
      selector: (row: any) => row.name,
      sortable: true,
    },
    {
      name: "Cadastro",
      selector: (row: any) => HandleOnlyDate(new Date(row.createdAt)),
      sortable: true,
    },
    {
      name: "Atualização",
      selector: (row: any) => HandleOnlyDate(new Date(row.updatedAt)),
      sortable: true,
    },    
    {
      cell: (row: any) => (
        <IconButton
          aria-label="update"
          size="large"
          onClick={updateProduct.bind(this, row.id)}
        >
          <EditIcon />
        </IconButton>
      ),
      allowOverflow: true,
      button: true,
      width: "56px",
    },
    {
      cell: (row: any) => (
        <IconButton
          aria-label="delete"
          size="large"
          onClick={() => handleClickOpen(row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
      allowOverflow: true,
      button: true,
      width: "56px",
    },
  ];

  return (
    <>
      <Head title="Rede Unisoft - Categorias" />
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
          <Link to={`/category/createCategory/${id}`}>
            <Button variant="contained" color="success" startIcon={<AddIcon />}>
              Cadastrar Categoria
            </Button>
          </Link>
          <div className="info-user">
            <h1> Categorias </h1>
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
      <ModalConfirm
        action={deleteCategory.bind(this, idProduct)}
        title="Deseja excluir esta categoria?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Excluir"
      />
    </>
  );
}
