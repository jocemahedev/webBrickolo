import  { useEffect, useState } from "react";
import { useReduxDispatch } from "../../redux";
import { setCurrentCompleteFilter } from "../../redux/set";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";

export function CompletePartsFilter() {
  const dispatch = useReduxDispatch();
  const [completeFilter, setCompleteFilter] = useState<
    "none" | "complete" | "incomplete"
  >("none");
  const [value, setValue] = useState("");
  useEffect(() => {
    console.log("completeFilter");
    dispatch(setCurrentCompleteFilter(completeFilter));
  }, [dispatch, completeFilter]);
  const completeFilterHandler = (
    event: any,
    filterComplete: "none" | "complete" | "incomplete"
  ): void => {
    console.log(event);
    console.log(value);
    if (completeFilter === filterComplete) {
      console.log("on none");
      setCompleteFilter("none");
    } else {
      console.log("on " + filterComplete);
      setCompleteFilter(filterComplete);
    }
  };

  return (
    <Box sx={{ mx: 5, my: 0.5 }}>
      <ToggleButtonGroup
        color="primary"
        value={completeFilter}
        exclusive
        onChange={completeFilterHandler}
        aria-label="completeFilter"
      >
        <ToggleButton value="incomplete">Incomplete</ToggleButton>
        <ToggleButton value="complete">Complete</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
