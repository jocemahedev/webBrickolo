import { countSets } from "../../redux/collection";
import { useReduxSelector } from "../../redux";
import BoxInfo from "../ui/BoxInfo";

const CountSets = () => {
  const numberSets = useReduxSelector(countSets);
  const info = "You have " + numberSets + " sets";
  return <BoxInfo info={info} />;
};

export default CountSets;
