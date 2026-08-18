import Button from "@mui/material/Button";
import { Modal, Backdrop, Fade } from "@mui/material";
import { styleModal } from "./StyleModal";
import { useForm } from "react-hook-form";

/* Imports REACT */
import { useParams } from "react-router-dom";

/* Imports MUI */
import { Box, TextField, Typography } from "@mui/material";

/* Imports CSS */
import "react-toastify/dist/ReactToastify.css";

/* Imports Extras */
import { api } from "../../api/api";
import { getTokenLocalStorage } from "../../state/SaveLocalStorage";

export function ModalInsertCategory(props: any) {
  const { id } = useParams() as { id: string };
  const token = getTokenLocalStorage();

  /*lidar com formulário */
  const { register, handleSubmit } = useForm();

  /* consulta backend */
  const registerCategory = (data: any) =>
    api
      .post(`/category/${id}`, data, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
          props.setClose(false);
      });

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.setOpen}
      onClose={props.setClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.setOpen}>
        <Box
          sx={styleModal}
          component="form"
          onSubmit={handleSubmit(registerCategory)}
        >
          <Typography id="transition-modal-title" variant="h6" component="h2">
            Adicionar Categoria
          </Typography>
          <TextField
            {...register("name")}
            autoFocus
            margin="dense"
            name="name"
            id="name"
            required
            label="Digite a Categoria"
            type="text"
            fullWidth
            variant="standard"
          />
          <div className="line-button mt-3">
            <Button type="submit" variant="contained" color="primary">
              Cadastrar
            </Button>
            <Button onClick={() => props.setClose(false)}>Cancelar</Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
