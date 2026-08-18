/*imports REACT */
import { Link } from "react-router-dom";

/*imports MUI */
import { Stack, Button } from "@mui/material";

/*INTERFACE */
import { IButton } from "./types/ComponentsInterfaces";

function ButtonDefault(props: IButton) {
  return (
    <div className="btn-default btn-default-lg">
      <Button type="submit" variant="contained">
        {props.contentBtnPrimary}
      </Button>
      <Link to={props.link}>
        <Button className="btn-default" variant="contained" color="secondary">
          {props.contentBtnSecondary}
        </Button>
      </Link>
    </div>
  );
}

export { ButtonDefault };
