/*imports react */
import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

/*imports libs */
import { ToastContainer, toast } from "react-toastify";
import DataTable from "react-data-table-component";

/*imports extras */
import { api } from "../../api/api";
import { Header } from "../partials/Header";

/*imports styles CSS */
import "react-toastify/dist/ReactToastify.css";

/*imports MUI */
import Paper from "@mui/material/Paper";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { ModalConfirm } from "../../components/Modals/ModalConfirm";
import { Head } from "../partials/Head";
import ClearIcon from "@mui/icons-material/Clear";

import { HandleOnlyDate } from "../../services/HandleOnlyDate";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";
import React from "react";

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

export function Products(this: any) {
  const token = getTokenLocalStorage();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [countProducts, setCountProducts] = useState("");

  const [idProduct, setIdProduct] = useState("");
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const handleClickOpen = (id: string) => {
    setIdProduct(id);
    setOpen(true);
  };

  /*Consultas BACKEND */
  useEffect(() => {
    api
      .get("/products/" + id, {
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

  async function deleteProduct(id: string) {
    await api
      .delete("products/" + id, {
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

  useEffect(() => {
    api
      .get("/products/countProducts/" + id, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        setCountProducts(res.data);
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

  function updateProduct(id: number) {
    navigate(`/products/updateProduct/${id}`);
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
      name: "Categoria",
      selector: (row: any) => `${row.categoryProduct}`,
      sortable: true,
    },
    {
      name: "Fornecedor",
      selector: (row: any) => `${row.fornecedor}`,
      sortable: true,
    },
    {
      name: "Quantidade",
      selector: (row: any) => row.quantity,
      sortable: true,
    },
    {
      name: "Estoque",
      selector: (row: any) => row.estoque,
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
      <Head title="Rede Unisoft - Produtos" />
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
            <div className="d-flex gap-2 btn-default">
              <Link to={`/products/createProduct/${id}`}>
                <Button
                  className="btn-default flex-row"
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                >
                  Cadastrar Produto
                </Button>
              </Link>
              <Link to={`/products/updateStock/${id}`}>
                <Button
                  className="d-flex gap-2 btn-default flex-row"
                  variant="contained"
                  color="primary"
                  startIcon={<ArrowUpwardIcon />}
                >
                  Atualizar Estoque
                </Button>
              </Link>
            </div>
            <div>
              <strong>{`Total de produtos: ${countProducts}`}</strong>
            </div>
          </div>
          <div className="info-user">
            <h1> Produtos </h1>
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
        action={deleteProduct.bind(this, idProduct)}
        title="Deseja excluir este produto?"
        setOpen={open}
        setClose={handleClose}
        infoOne="Excluir"
      />
    </>
  );
}
