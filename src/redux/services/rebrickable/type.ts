import { Color } from "../../../types/types";

export type RebrickableSet = {
  last_modified_dt: string;
  name: string;
  num_parts: number;
  set_img_url: string;
  set_num: string;
  set_url: string;
  theme_id: number;
  year: number;
};
export type RebrickablePart = {
  index: number;
  id: string;
  color: ColorRebrickable;
  cat_id: string;
  part: SubRebrickablePart;
  element_id: string;
  set_num: string;
  quantity: number;
  inv_part_id: string;
  is_spare: boolean;
};
export type ColorRebrickable = {
  id: string;
  name: string;
  rgb: string;
  is_trans: boolean;
};
export type SubRebrickablePart = {
  part_img_url: string;
  name: string;
  part_url: string;
  part_num: string;
  part_cat_id: string;
};
export type RebrickableProps = {
  set: RebrickableSet;
  parts: RebrickablePart[] | undefined;
};
