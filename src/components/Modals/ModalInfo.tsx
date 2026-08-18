/*imports REACT */
import { Link } from "react-router-dom";

/*imports MUI */
import { Modal, Backdrop, Fade, Box, Typography, Button } from "@mui/material";

/*imports CSS */
import "../styles/ModalInfo.scss";

/*imports Estilo Modal */
import { styleModal } from "./StyleModal";

function ModalInfo(props: any) {
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
              <Button>{props.textButon}</Button>
            </Link>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export { ModalInfo };
