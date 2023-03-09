import { Button } from "@mui/material";
import { signOut } from "./../redux/services/firebase/AuthRequest";

import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";

export function Header() {
  const navigate = useNavigate();

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
