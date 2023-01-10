import { Button } from "@mui/material";
import { signOut } from "./../redux/services/firebase/AuthRequest";

import {  useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReduxDispatch, useReduxSelector } from "./../redux";
import { getIncompleteParts, selectAllSets } from "./../redux/collection";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export function Header() {
  const dispatch = useReduxDispatch();
  const allSets = useReduxSelector(selectAllSets);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            My Collection
          </Button>
          |
          <Button color="inherit" onClick={() => navigate("search-set")}>
            Search set
          </Button>
          |
          <Button
            color="inherit"
            onClick={() => {
              dispatch(getIncompleteParts(allSets));
              navigate("missing-parts-list");
            }}
          >
            Missing Parts
          </Button>
        </Box>

        <Button color="inherit" onClick={signOut}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
