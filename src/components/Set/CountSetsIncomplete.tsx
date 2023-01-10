import { selectIncompleteParts } from "../../redux/collection";
import { useReduxSelector } from "../../redux";
import BoxInfo from "../ui/BoxInfo";

const CountSetsIncomplete = () => {
  const numberSets = useReduxSelector(selectIncompleteParts);
  const info = "You have " + numberSets.length + " sets incomplete";
  return <BoxInfo info={info} />;
};

export default CountSetsIncomplete;
