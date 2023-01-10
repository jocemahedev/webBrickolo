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
} from "../../redux/collection";
import { Set } from "../../types/types";
import { Badge, ListItemAvatar, Typography } from "@mui/material";
import CountSets from "../Set/CountSets";
import ButtonCustom from "../ui/ButtonCustom";

export function CollectionList({ pressSet }: CollectionListProps) {
  const currentCollection = useReduxSelector(selectCurrentCollection);
  const allSets = useReduxSelector(selectAllSets);
  const dispatch = useReduxDispatch();
  useEffect(() => {
    dispatch(fetchSets());
    console.log("fetchSet CollectionList");
  }, [currentCollection, dispatch]);

  return (
    <div>
      <CountSets />
      <List>
        {allSets.map((oneSet) => (
          <div key={oneSet.id}>
            <Item set={oneSet} onPress={pressSet}></Item>
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
  const numberMissing = set.quantityParts - set.quantityCollectorParts;
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

type CollectionListProps = {
  pressSet: (set: Set) => void;
};

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
