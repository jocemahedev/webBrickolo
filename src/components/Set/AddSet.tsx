import { Box, Button, Snackbar } from "@mui/material";
import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  addSet,
  selectAddSetStatus,
  setAddSetStatus,
} from "../../redux/collection";

import { RebrickableSet } from "../../redux/services/rebrickable/type";
import { Fragment, useState } from "react";
import ButtonCustom from "../ui/ButtonCustom";
const AddSet = ({ previewSet }: AddSetProps) => {
  const [open, setOpen] = useState(false);
  const dispatch = useReduxDispatch();
  const addSetStatus = useReduxSelector(selectAddSetStatus);
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    console.log("handleClose");
    console.log(reason);
    dispatch(setAddSetStatus("none"));
    setOpen(false);
  };
  const MESSAGE_SNACKBAR = previewSet.set_num + " was added to collection.";

  const action = (
    <Fragment>
      <Button color="secondary" size="large" onClick={handleClose}>
        X
      </Button>
    </Fragment>
  );
  return (
    <Box
      sx={{ width: "100%", m: 0, display: "flex", justifyContent: "center" }}
    >
      <Snackbar
        open={addSetStatus === "fulfilled"}
        autoHideDuration={6000}
        message={MESSAGE_SNACKBAR}
        onClose={handleClose}
        action={action}
      />

      <ButtonCustom
        title={"Add Set"}
        onClick={() => {
          setOpen(true);
          dispatch(addSet(previewSet));
        }}
      />
    </Box>
  );
};

type AddSetProps = {
  previewSet: RebrickableSet;
};

export default AddSet;
