import { useReduxSelector } from "../../redux";
import { selectIncompleteParts } from "../../redux/collection";

import MissingPartsList from "../List/MissingPartsList";
import BoxPage from "../ui/BoxPage";

export default function MissingPartsListPage() {
  const missingParts = useReduxSelector(selectIncompleteParts);

  return (
    <BoxPage titlePage="Missing parts">
      <MissingPartsList incompleteParts={missingParts} />
    </BoxPage>
  );
}
