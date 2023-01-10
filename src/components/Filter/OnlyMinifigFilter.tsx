import { useEffect, useState } from "react";
import { useReduxDispatch } from "../../redux";
import { setOnlyMinifig } from "../../redux/set";
import { Box, FormControlLabel, FormGroup, Switch } from "@mui/material";

export default function OnlyMinifigFilter() {
  const dispatch = useReduxDispatch();

  const [minifigFilter, setMinifigFilter] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setOnlyMinifig(minifigFilter));
  }, [dispatch, minifigFilter]);

  const minifigFilterHandler = (filterMinifig: boolean): void => {
    setMinifigFilter(!filterMinifig);
  };

  return (
    <Box sx={{ mx: 0, my: 1 }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              value={!minifigFilter}
              onChange={() => minifigFilterHandler(minifigFilter)}
            />
          }
          label={"Only Minifig"}
        />
      </FormGroup>
    </Box>
  );
}
