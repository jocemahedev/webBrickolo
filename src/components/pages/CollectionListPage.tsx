import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  fetchSets,
  selectAllSets,
  selectCurrentCollection,
  setCurrentIndexSet,
} from "../../redux/collection";
import { Set } from "../../types/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CollectionList } from "../List/CollectionList";
import BoxPage from "../ui/BoxPage";

export default function CollectionListPage() {
  const title = "Collection";
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  const currentCollection = useReduxSelector(selectCurrentCollection);
  const allSets = useReduxSelector(selectAllSets);
  const onPressSet = (set: Set) => {
    console.log("press" + set.name);
    dispatch(setCurrentIndexSet(set));
    navigate("parts-list");
  };
  useEffect(() => {
    dispatch(fetchSets());
  }, [currentCollection, dispatch]);

  return (
    <BoxPage titlePage="Collection">
      <CollectionList pressSet={onPressSet} />
    </BoxPage>
  );
}
