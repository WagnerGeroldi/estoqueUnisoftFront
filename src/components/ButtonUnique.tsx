/*imports REACT */
import { Link } from "react-router-dom";

/*imports MUI */
import { Stack, Button } from "@mui/material";

/*INTERFACE */
import { IButtonUnique } from "./types/ComponentsInterfaces";

function ButtonUnique(props: IButtonUnique) {
  return (
    <Stack spacing={2} marginTop={2} direction="row" justifyContent="center">
      <Link to={props.link}>
        <Button variant="contained" color="primary">
          {props.contentBtn}
        </Button>
      </Link>
    </Stack>
  );
}

export { ButtonUnique };
