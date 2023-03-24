import { useEffect, useState } from "react";
import { Color } from "../../types/types";
import { useReduxDispatch } from "../../redux";
import { setCurrentColors } from "../../redux/set";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ColorsFilter = ({ colors }: CheckmarksProps) => {
  return (
    <div>
      <MultipleSelectCheckmarks colors={colors} />
    </div>
  );
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export function MultipleSelectCheckmarks({ colors }: CheckmarksProps) {
  const handleChange = (event: SelectChangeEvent<typeof activeColors>) => {
    const {
      target: { value },
    } = event;

    console.log(event.target.value[event.target.value.length - 1]);
    const nameColor = event.target.value[event.target.value.length - 1];
    console.log("event");
    if (activeColors.find((activeColor) => activeColor.name === nameColor)) {
      console.log("on trouve la couleur");
      setActiveColors(
        activeColors.filter((activeColor) => activeColor.name !== nameColor)
      );
    } else {
      const color = colors.find((oneColor) => oneColor.name === nameColor);
      if (color) {
        setActiveColors([...activeColors, color]);
      }
    }
  };
  const dispatch = useReduxDispatch();
  const [activeColors, setActiveColors] = useState<Color[]>([]);
  const getRGBColor = (color: Color): string => {
    if (color.name === "White" || color.name === "Trans-Clear") {
      return "#ccf2ff";
    }
    return "#" + color.codeRgb;
  };
  useEffect(() => {
    dispatch(setCurrentColors(activeColors));
  }, [dispatch, activeColors]);


  return (
      <FormControl sx={{  width:'300px' }}>
        <InputLabel id="demo-multiple-checkbox-label">
          Filter by color
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={activeColors}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => renderSelectedColor(selected)}
          MenuProps={MenuProps}
        >
          {colors.map((color) => (
            <MenuItem
              key={color.id}
              value={color.name}
              style={{ color: getRGBColor(color) }}
            >
              <Checkbox checked={colorIsActive(color, activeColors)} />
              <ListItemText primary={color.name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
}
const colorIsActive = (color: Color, colors: Color[]): boolean => {
  if (colors.find((oneColor) => oneColor.id === color.id)) {
    return true;
  }
  return false;
};
const renderSelectedColor = (colors: Color[]): string => {
  if (colors.length <= 0) return "Choose Color";
  return colors
    .map((color) => {
      return color.name;
    })
    .join(", ");
};
type CheckmarksProps = {
  colors: Color[];
};
export default ColorsFilter;
