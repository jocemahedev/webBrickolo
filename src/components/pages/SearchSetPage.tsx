
import { useReduxDispatch } from "../../redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchResult from "../Set/SearchResult";
import Box from "@mui/material/Box";

import InputAdornment from "@mui/material/InputAdornment";

import TextField from "@mui/material/TextField";
import CountSets from "../Set/CountSets";

import BoxPage from "../ui/BoxPage";
import ButtonCustom from "../ui/ButtonCustom";

export default function SearchSetPage() {
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(true);

  const handleChange = (event: any) => {
    console.log("event");
    setText(event.target.value);
  };
  const handleClick = () => {
    setSearchVisible(false);
    setSearch(text);
  };
  return (
    <BoxPage titlePage="Search Set">
      <Box sx={{ mx: 0, justifyContent: "center", display: "flex" }}>
        <Box sx={{ mx: 0, py: 0, justifyContent: "center" }}>
          <CountSets />
          {searchVisible && (
            <>
              <TextField
                label="Search Lego"
                onChange={handleChange}
                id="search-set"
                helperText="Type reference lego like 31120"
                sx={{ m: 1, width: "25ch" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <b>-1</b>
                    </InputAdornment>
                  ),
                }}
              />
              <ButtonCustom title={"Search"} onClick={handleClick} />
            </>
          )}
          {!searchVisible && (
            <ButtonCustom
              title={"New search"}
              onClick={() => setSearchVisible(true)}
            />
          )}
        </Box>
        {search && !searchVisible && <SearchResult setIdLego={search} />}
      </Box>
    </BoxPage>
  );
}
