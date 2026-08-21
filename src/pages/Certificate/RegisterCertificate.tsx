/* Imports REACT */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

/* Imports MUI */
import {
  Box,
  Grid,
  Paper,
  TextField,
  Card,
  CardContent,
  Typography,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/* Imports Libs */
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";

/* Imports CSS */
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
// import { ButtonDefault } from "../../components/Button";
import { Header } from "../partials/Header";
import { Head } from "../partials/Head";
import { ButtonDefault } from "../../components/button/ButtonDefault";

/*Import de Componentes */
// import { ModalInsertCategory } from "../../components/Modals/ModalInsertCategory";
// import { ModalInfo } from "../../components/Modals/ModalInfo";
// import { Spinner } from "../../components/Spinner";

/*Interface*/
interface ICertificateRegister {
  nome: string;
  curso: string;
  periodo: string;
  cidade: string;
}

/* Validações */
const validationRegistrerUser = yup.object().shape({
  nome: yup.string().required("O nome é obrigatório"),
  curso: yup.string().required("O curso é obrigatório"),
  periodo: yup.string().required("O período é obrigatório"),
  cidade: yup.string().required("A cidade é obrigatório"),
});

export function RegisterCertificate() {
  let navigate = useNavigate();

  /*lidar com formulário */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICertificateRegister>({
    resolver: yupResolver(validationRegistrerUser),
  });

  /* consulta backend */
  const registerCertificado = (data: ICertificateRegister) =>
    api
      .post(`/certificados/cadastrar/`, data)
      .then((res) => {
        toast.success("Certificado cadastrado!");
        setTimeout(() => {
          navigate("/certificateList/");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        
      });

  return (
    <>
      <Head title="Rede Unisoft - Cadastrar Certificado" />
      <Header />
      <div className="container">
        <Card sx={{ maxWidth: 875 }}>
          <ToastContainer />
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              <i className="fa fa-user-plus fa-2x" aria-hidden="true"></i>{" "}
              Cadastro de certificado
            </Typography>
            <br />
            <p>Cadastre os dados do certificado!</p>
            <Paper sx={{ p: 2, margin: "auto", maxWidth: 1100, flexGrow: 1 }}>
              <Box
                onSubmit={handleSubmit(registerCertificado)}
                component="form"
                sx={{ flexGrow: 1 }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="nome"
                        {...register("nome")}
                        label="Nome"
                        variant="outlined"
                        fullWidth
                        type="text"
                        placeholder="Exe: João da Silva Mendes"
                        size="small"
                      />
                      <p className="error-message">{errors.nome?.message}</p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="curso"
                        {...register("curso")}
                        label="Curso"
                        size="small"
                        fullWidth
                        type="text"
                        variant="outlined"
                        placeholder="Exe: QIT"
                      />
                      <p className="error-message">{errors.curso?.message}</p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex flex-column gap-1">
                      <TextField
                        id="periodo"
                        {...register("periodo")}
                        label="Período"
                        size="small"
                        type="text"
                        fullWidth
                        placeholder="exe: 2020/2021"
                        variant="outlined"
                      />
                      <p className="error-message">{errors.periodo?.message}</p>
                    </div>
                  </Grid>
                  <Grid item lg={6} md={6} xs={12}>
                    <div className="d-flex gap-2 align-items-start">
                      <div className="d-flex flex-column gap-1 w-100">
                        <TextField
                          id="cidade"
                          {...register("cidade")}
                          label="Cidade"
                          size="small"
                          type="text"
                          fullWidth
                          placeholder="exe: Correntina - BA"
                          variant="outlined"
                        />
                        <p className="error-message">
                          {errors.cidade?.message}
                        </p>
                      </div>
                    </div>
                  </Grid>
                </Grid>
                <ButtonDefault content={"Cadastrar"} link={""} contentBtnPrimary={undefined} contentBtnSecondary={""} />
              </Box>
            </Paper>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
