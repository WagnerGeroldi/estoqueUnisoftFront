/*imports MUI */
import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";

/*imports CSS */
import "../styles/ModalConfirm.scss";

/*imports Estilo Modal */
import { styleModal } from "./StyleModal";

function ModalClearList(props: any) {
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
        <Box sx={styleModal}>
          <Typography id="transition-modal-title" variant="h6" component="h2">
            {props.title}
          </Typography>
          <Typography
            id="transition-modal-description"
            sx={{ mt: 2 }}
            textAlign={"justify"}
          >
            {props.text}
          </Typography>
          <div className="line-button">
            <Button onClick={props.action} variant="contained" color="primary">
              {props.infoOne}
            </Button>
            <Button onClick={() => props.setClose(false)}>Cancelar</Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export { ModalClearList };
