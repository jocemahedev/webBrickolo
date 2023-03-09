import { Badge, Box, Divider, Grid, Typography } from "@mui/material";
import { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  getIncompleteParts,
  selectAllSets,
  selectIncompleteParts,
} from "../../redux/collection";
import { cleanParts } from "../../redux/set";
import { IncompleteParts, Part, Set } from "../../types/types";
import Quantity from "../Part/Quantity";
import CountSetsIncomplete from "../Set/CountSetsIncomplete";

export const MISSING_TEXT = "Missing parts";
const MissingPartsList = () => {
  const missingParts = useReduxSelector(selectIncompleteParts);
  const allSets = useReduxSelector(selectAllSets);
  const dispatch = useReduxDispatch();
  useEffect(() => {
    dispatch(getIncompleteParts(allSets));
    //dispatch(cleanParts());
    //dispatch(cleanSets());
    return () => {};
  }, [dispatch]);
  return (
    <Box>
      <CountSetsIncomplete numberSets={missingParts.length} />
      {missingParts.map((oneIncompleteParts) => {
        return (
          <SectionItem
            key={oneIncompleteParts.set.id}
            set={oneIncompleteParts.set}
            parts={oneIncompleteParts.data}
          />
        );
      })}
    </Box>
  );
};
function Item({ part }: ItemProps) {
  const numberMissing = part.quantityPart - part.quantityCollectorPart;
  return (
    <Grid item style={{ border: "solid 0.5px", padding: 5, margin: 5 }}>
      <p>
        <b>{part.idElement}</b>
      </p>
      <Badge color="error" badgeContent={numberMissing}>
        <img width="50px" src={part.imageUrl} />
      </Badge>
      <Quantity part={part} />
    </Grid>
  );
}
function SectionItem({ set, parts }: SectionItemProps) {
  const numberMissing = set.quantityParts - set.quantityCollectorParts;

  return (
    <>
      <Divider />
      <Box sx={{ py: 4, display: "flex" }}>
        <Badge color="error" badgeContent={numberMissing}>
          <img width="80px" src={set.imageUrl} />
        </Badge>
        <Typography sx={{ mx: 2 }} variant="h5">
          {set.idLego}
        </Typography>
        <Typography sx={{ mx: 1 }} variant="h6">
          {set.name}
        </Typography>
      </Box>
      <Box sx={{ py: 0 }}>
        <Typography sx={{ paddingBottom: 2 }} variant="h6">
          {set.quantityParts - set.quantityCollectorParts + " " + MISSING_TEXT}
        </Typography>
        <Grid container spacing={2}>
          {parts.map((part) => (
            <Item part={part} key={part.idElement + part.index + set.id} />
          ))}
        </Grid>
      </Box>
      <Divider />
    </>
  );
}

type ItemProps = {
  part: Part;
};
type SectionItemProps = {
  set: Set;
  parts: Part[];
};

export default MissingPartsList;
