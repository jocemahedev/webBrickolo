import { Part } from "../../types/types";

import {
  completePart,
  decrementPart,
  incrementPart,
  updateParts,
} from "../../redux/set";
import { useReduxDispatch } from "../../redux";
import { Button, ButtonGroup } from "@mui/material";

const Quantity = ({ part }: QuantityProps) => {
  const dispatch = useReduxDispatch();
  return (
    <div>
      <ButtonGroup
        variant="contained"
        aria-label="outlined primary button group"
      >
        <Button
          size="small"
          onClick={() => {
            dispatch(decrementPart(part));
            dispatch(updateParts());
          }}
        >
          -
        </Button>

        <Button
          size="small"
          onClick={() => {
            dispatch(incrementPart(part));
            dispatch(updateParts());
          }}
        >
          +
        </Button>
        <Button
          size="small"
          onClick={() => {
            dispatch(completePart(part));
            dispatch(updateParts());
          }}
        >
          ✔️
        </Button>
      </ButtonGroup>
    </div>
  );
};

type QuantityProps = {
  part: Part;
};

export default Quantity;
