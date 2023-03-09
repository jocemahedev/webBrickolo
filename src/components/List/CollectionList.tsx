import { useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  fetchSets,
  selectAllSets,
  selectCurrentCollection,
  deleteSet,
  deleteParts,
  completeSet,
  setCurrentIndexSet,
} from "../../redux/collection";
import { Set } from "../../types/types";
import { Badge, ListItemAvatar, Typography } from "@mui/material";
import CountSets from "../Set/CountSets";
import ButtonCustom from "../ui/ButtonCustom";
import { useNavigate } from "react-router-dom";
import { cleanParts } from "../../redux/set";

export function CollectionList() {
  const currentCollection = useReduxSelector(selectCurrentCollection);
  const navigate = useNavigate();
  const allSets = useReduxSelector(selectAllSets);
  const dispatch = useReduxDispatch();
  useEffect(() => {
    dispatch(cleanParts());
    dispatch(fetchSets());
  }, [currentCollection, dispatch]);

  const onPressSet = (set: Set) => {
    dispatch(setCurrentIndexSet(set));
    navigate("parts-list");
  };

  return (
    <div>
      <CountSets />
      <List>
        {allSets.map((oneSet) => (
          <div key={oneSet.id}>
            <Item set={oneSet} onPress={onPressSet}></Item>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}
function Item({ set, onPress }: ItemProps) {
  const dispatch = useReduxDispatch();
  const deleteSetHandler = (deletedSet: Set) => {
    dispatch(deleteSet(deletedSet.id));
    dispatch(deleteParts(deletedSet.idParts));
  };
  const completeSetHandler = (setToBeCompleted: Set) => {
    dispatch(completeSet(setToBeCompleted));
  };
  let badgeColor: "success" | "error";
  let badgeText;
  const isCompleted = set.quantityCollectorParts === set.quantityParts;
  const quantityText = set.quantityCollectorParts + "/" + set.quantityParts;
  if (isCompleted) {
    badgeColor = "success";
    badgeText = "complete";
  } else {
    badgeColor = "error";
    badgeText = set.quantityParts - set.quantityCollectorParts + " missing";
  }
  return (
    <ListItem>
      <Typography variant="h6" sx={{ width: 100 }}>
        {set.idLego}
      </Typography>

      <ListItemAvatar>
        <img width="100px" src={set.imageUrl} />
      </ListItemAvatar>
      <Badge
        color={badgeColor}
        badgeContent={badgeText}
        sx={{ paddingLeft: 5, paddingRight: 5 }}
      ></Badge>

      <ListItemText
        sx={{ paddingLeft: 10, paddingRight: 5 }}
        primary={set.name}
        secondary={quantityText}
      ></ListItemText>

      <ButtonCustom title={"Delete"} onClick={() => deleteSetHandler(set)} />
      <ButtonCustom
        title={"Complete"}
        onClick={() => completeSetHandler(set)}
      />
      <ButtonCustom title={"View Parts"} onClick={() => onPress(set)} />
    </ListItem>
  );
}

type ItemProps = {
  set: Set;
  onPress: (set: Set) => void;
};

export default function BasicList() {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon></ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Trash" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
              <ListItemText primary="Spam" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
