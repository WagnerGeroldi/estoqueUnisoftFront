
/*imports MUI */
import { Stack, Button } from "@mui/material";

/*INTERFACE */
import { IButton } from "./InterfaceBtn";

function ButtonDefault(props: IButton) {
  return (
    <div className= {`btn-default btn-default-lg `}>
      <Button type="submit" variant="contained" >
        {props.content  }
      </Button>
    </div>
  );
}

export { ButtonDefault };
