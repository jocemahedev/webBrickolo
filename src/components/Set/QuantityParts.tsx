import { useEffect } from "react";
import { useReduxDispatch, useReduxSelector } from "../../redux";
import {
  updateQuantityCurrentSet,
  updateQuantitySet,
} from "../../redux/collection";
import { selectAllParts } from "../../redux/set";
import BoxInfo from "../ui/BoxInfo";

export default function QuantityParts() {
  const dispatch = useReduxDispatch();
  useEffect(() => {
    dispatch(updateQuantitySet(quantityCollectorParts));
    dispatch(updateQuantityCurrentSet(quantityCollectorParts));
  });
  const allQuantityParts = useReduxSelector(selectAllParts);
  const quantityCollectorParts = allQuantityParts.reduce(
    (tot, part) => tot + part.quantityCollectorPart,
    0
  );
  const quantityParts = allQuantityParts.reduce(
    (tot, part) => tot + part.quantityPart,
    0
  );
  const info =
    "You have " + quantityCollectorParts + " of " + quantityParts + "  parts";
  return <BoxInfo info={info} />;
}
