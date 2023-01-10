import { useReduxDispatch, useReduxSelector } from "../../redux";
import { fetchParts, selectPartsByColorByCompleted } from "../../redux/set";
import { useEffect } from "react";
import PartsList from "../List/PartsList";
import BoxPage from "../ui/BoxPage";

export default function PartsListPage() {
  const dispatch = useReduxDispatch();
  const allParts = useReduxSelector(selectPartsByColorByCompleted);

  useEffect(() => {
    console.log("on arrive sur la page parts list");
    dispatch(fetchParts());
  }, [dispatch]);
  console.log(allParts);
  return (
    <BoxPage titlePage="Parts">
      <PartsList parts={allParts}></PartsList>
    </BoxPage>
  );
}
