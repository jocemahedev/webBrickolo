import { CardMedia } from "@mui/material";
import { useReduxSelector } from "../../redux";
import { selectAddSetStatus, setAddSetStatus } from "../../redux/collection";
import { useGetSetByIdLegoQuery } from "../../redux/services/rebrickable/rebrickable.web";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import AddSet from "./AddSet";

const SearchResult = ({ setIdLego }: SetSearchResultProps) => {
  const { data, isLoading, error } = useGetSetByIdLegoQuery(setIdLego + "-1");

  const addSetStatus = useReduxSelector(selectAddSetStatus);

  return (
    <div>
      {error && <div>{"set number: " + setIdLego + " "}</div>}
      {isLoading && <div>{"Loading"}</div>}
      {!error && data && (
        <Card sx={{ maxWidth: 600 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {data?.set_num}
            </Typography>
            <Typography variant="h5" component="div">
              {data?.name}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {data?.num_parts} parts
            </Typography>
            <CardMedia
              component="img"
              sx={{ width: 550 }}
              image={data?.set_img_url}
              alt="image set lego"
            />
          </CardContent>
          {addSetStatus === "pending" && <div>{"Loading"}</div>}
          {addSetStatus !== "pending" && (
            <CardActions>
              <AddSet previewSet={data} />
            </CardActions>
          )}
        </Card>
      )}
    </div>
  );
};

type SetSearchResultProps = {
  setIdLego: string;
};

export default SearchResult;
