import { useEffect, useState } from "react";

import { Part } from "../../types/types";

import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  fetchParts,
  selectAllColors,
  selectPartsByColorByCompleted,
  selectStatus,
} from "../../redux/set";
import { Badge, Grid } from "@mui/material";
import ColorsFilter from "../Filter/ColorsFilter";
import { CompletePartsFilter } from "../Filter/CompletePartsFilter";
import OnlyMinifigFilter from "../Filter/OnlyMinifigFilter";
import Quantity from "../Part/Quantity";
import QuantityParts from "../Set/QuantityParts";
import { Box } from "@mui/system";

const PartsList = () => {
  const dispatch = useReduxDispatch();
  const allColors = useReduxSelector(selectAllColors);
  const status = useReduxSelector(selectStatus);
  const allParts = useReduxSelector(selectPartsByColorByCompleted);

  useEffect(() => {
    dispatch(fetchParts());
  }, [dispatch]);
  console.log(allParts);
  const isLoading = status === "loading";
  const zeroPart = allParts.length === 0;
  const ZERO_PART_MESSAGE = " Zéro part 🤦";
  const SEE_FILTER = "See Filters  🧐";
  const HIDE_FILTER = "Hide Filters 🫣";

  return (
    <div>
      {isLoading && (
        <div>
          <p>{"Loading..."}</p>
        </div>
      )}
      <QuantityParts />

      <Box
        sx={{
          display: "flex",
          py: 5,
          backgroundColor: "white",
          justifyContent: "left",
        }}
      >
        <ColorsFilter colors={allColors} />
        <CompletePartsFilter />
        <OnlyMinifigFilter />
      </Box>

      {!isLoading && (
        <>
          {zeroPart && <p>{ZERO_PART_MESSAGE}</p>}
          {!zeroPart && (
            <Grid container spacing={2}>
              {allParts.map((onePart, index) => (
                <Item key={index} part={onePart} />
              ))}
            </Grid>
          )}
        </>
      )}
    </div>
  );
};

function Item({ part }: ItemProps) {
  const isCompleted = part.quantityPart === part.quantityCollectorPart;
  const badgeText = part.quantityCollectorPart + "/" + part.quantityPart;
  let badgeColor: "success" | "error";
  isCompleted ? (badgeColor = "success") : (badgeColor = "error");

  return (
    <Grid item style={{ border: "solid 0.5px", padding: 5, margin: 5 }}>
      <p>
        <b>{part.idElement}</b>
      </p>
      <Badge color={badgeColor} badgeContent={badgeText}>
        <img width="50px" src={part.imageUrl} />
      </Badge>
      <Quantity part={part} />
    </Grid>
  );
}

type ItemProps = {
  part: Part;
};

export default PartsList;
