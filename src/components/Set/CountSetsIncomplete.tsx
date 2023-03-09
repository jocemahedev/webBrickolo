import { selectIncompleteParts } from "../../redux/collection";
import { useReduxSelector } from "../../redux";
import BoxInfo from "../ui/BoxInfo";

const CountSetsIncomplete = ({ numberSets }: CountSetsIncompleteProps) => {
  const info = "You have " + numberSets + " sets incomplete";
  return <BoxInfo info={info} />;
};


type CountSetsIncompleteProps = {
  numberSets: number;
};
export default CountSetsIncomplete;
