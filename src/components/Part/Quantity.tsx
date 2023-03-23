import { Part, PartToModify } from "../../types/types";

import {
  completePart,
  decrementPart,
  incrementPart,
  fetchParts,
} from "../../redux/set";
import { useReduxDispatch } from "../../redux";
import { Button, ButtonGroup } from "@mui/material";

const Quantity = ({ part }: QuantityProps) => {
  const dispatch = useReduxDispatch();
  const idParts = part.idParts;
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
            dispatch(fetchParts(idParts));
          }}
        >
          -
        </Button>

        <Button
          size="small"
          onClick={() => {
            dispatch(incrementPart(part));
            dispatch(fetchParts(idParts));
          }}
        >
          +
        </Button>
        <Button
          size="small"
          onClick={() => {
            dispatch(completePart(part));
            dispatch(fetchParts(idParts));
          }}
        >
          ✔️
        </Button>
      </ButtonGroup>
    </div>
  );
};

type QuantityProps = {
  part: PartToModify;
};

export default Quantity;
