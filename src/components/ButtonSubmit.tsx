/*imports MUI */
import { Stack, Button } from "@mui/material";

/*INTERFACE */
import { IButtonSubmit } from "./types/ComponentsInterfaces";

function ButtonSubmit(props: IButtonSubmit) {
  return (
    <Stack spacing={2} marginTop={2} direction="row" justifyContent="center">
      <Button type="submit" variant="contained">
        {props.contentBtnPrimary}
      </Button>
    </Stack>
  );
}

export { ButtonSubmit };
