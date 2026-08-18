/*imports MUI */
import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

/*imports CSS */
import "../styles/ModalConfirm.scss";

/*imports Estilo Modal */
import { styleModal } from "./StyleModal";

function ModalCancelSale(props: any) {
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
            <Link to={props.link}>
              <Button
                onClick={props.action}
                variant="contained"
                color="primary"
              >
                {props.infoOne}
              </Button>
            </Link>
            <Button onClick={() => props.setClose(false)}>Cancelar</Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export { ModalCancelSale };
