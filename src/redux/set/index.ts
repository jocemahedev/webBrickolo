import {
  PayloadAction,
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { Set, Part, Color, PartToModify } from "../../types/types";
import { db } from "../services/firebase/firebaseConfig";
import {
  ref,
  set,
  update,
  get,
  query,
  DatabaseReference,
} from "firebase/database";
import { AppDispatch, RootState } from "..";
import { RebrickablePart } from "../services/rebrickable/type";
import { rebrickableApi } from "../services/rebrickable/rebrickable.web";
import { selectCurrentSet } from "../collection";
export type SetState = {
  currentSet?: Set;
  allParts: Part[];
  statusParts: "loading" | "fulfilled";
  currentColors: Color[];
  currentCompleteFilter: "none" | "complete" | "incomplete";
  onlyMinifig: boolean;
};
export const initialState: SetState = {
  currentSet: undefined,
  allParts: [],
  statusParts: "loading",
  currentColors: [],
  currentCompleteFilter: "none",
  onlyMinifig: false,
};
const transformRebrickableParts = (
  rebrickablePart: RebrickablePart[],
  idSet: string
) => {
  return rebrickablePart
    .filter((part) => part.is_spare === false)
    .map((part, index) => {
      const isMiniFig = part.set_num.startsWith("fig");
      let idMiniFig = null;
      if (isMiniFig) {
        idMiniFig = part.set_num;
      }
      return {
        id: part.id,
        name: part.part.name,
        idElement: part.element_id,
        idCategory: part.part.part_cat_id,
        index: index,
        color: {
          id: (part.color.id),
          name: part.color.name,
          codeRgb: part.color.rgb,
          isTransparent: part.color.is_trans,
        },
        imageUrl: part.part.part_img_url,
        quantityPart: part.quantity,
        quantityCollectorPart: 0,
        idSet: idSet,
        isMiniFig: isMiniFig,
        idMiniFig: idMiniFig,
      };
    });
};

export const addParts = createAsyncThunk<void, RebrickablePart[]>(
  "set/addParts",
  async (rebrickableParts: RebrickablePart[], { getState, dispatch }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const currentSet = selectCurrentSet(rootState);
    const parts = ref(db, "/parts/" + idSets + "/" + currentSet?.idParts);
    if (currentSet?.idLego) {
      const newParts = transformRebrickableParts(
        rebrickableParts,
        currentSet?.idLego
      );
      set(parts, newParts);
      dispatch(setAllParts(newParts));
    }
  }
);

const fetchPartsAction = async (idParts: String, dispatch: AppDispatch) => {
  const dbRef = ref(db, "/parts/" + idParts);
  const dataSnapshot = await get(query(dbRef));
  const values: Part[] = dataSnapshot.val();
  let datas: Part[] = [];
  for (const data in values) {
    datas.push(values[data]);
  }

  dispatch(setAllParts(datas));
};
export const fetchParts = createAsyncThunk<void, String>(
  "set/fetchParts",
  async (idParts: String, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const dbRef = ref(db, "/parts/" + idSets + "/" + idParts);
    const dataSnapshot = await get(query(dbRef));
    const values: Part[] = dataSnapshot.val();
    let datas: Part[] = [];
    for (const data in values) {
      datas.push(values[data]);
    }
    dispatch(setAllParts(datas));
  }
);

export const incrementPart = createAsyncThunk<boolean, PartToModify>(
  "set/incrementPart",
  async (partToModify, { getState }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const part = partToModify.part;
    const idParts = partToModify.idParts;
    const indexPart = part.index;
    if (part.quantityCollectorPart < part.quantityPart) {
      const newQuantity = part.quantityCollectorPart + 1;
      const dbRef = ref(
        db,
        "/parts/" + idSets + "/" + idParts + "/" + indexPart
      );
      await updatePart(dbRef, newQuantity);
      return true;
    }

    return false;
  }
);
export const completePart = createAsyncThunk<boolean, PartToModify>(
  "set/completePart",
  async (partToModify, { getState }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const part = partToModify.part;
    const idParts = partToModify.idParts;
    const indexPart = part.index;
    if (part.quantityCollectorPart !== part.quantityPart) {
      const newQuantity = part.quantityPart;
      const dbRef = ref(
        db,
        "/parts/" + idSets + "/" + idParts + "/" + indexPart
      );
      await updatePart(dbRef, newQuantity);
      return true;
    }
    return false;
  }
);
export const decrementPart = createAsyncThunk<void, PartToModify>(
  "set/decrementPart",
  async (partToModify, { getState }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    console.log("⊖ on décremente");
    console.log(partToModify);

    const part = partToModify.part;
    const idParts = partToModify.idParts;
    const indexPart = part.index;
    if (part.quantityCollectorPart > 0) {
      const newQuantity = part.quantityCollectorPart - 1;
      const dbRef = ref(
        db,
        "/parts/" + idSets + "/" + idParts + "/" + indexPart
      );
      await updatePart(dbRef, newQuantity);
    }
  }
);
export const updatePart = async (
  dbRef: DatabaseReference,
  quantity: number
) => {
  await update(dbRef, { quantityCollectorPart: quantity });
};

const SetSlice = createSlice({
  name: "Set",
  initialState: initialState,
  reducers: {
    setAllParts(state, action: PayloadAction<Part[]>) {
      state.allParts = action.payload;
    },
    setCurrentColors(state, action: PayloadAction<Color[]>) {
      state.currentColors = action.payload;
    },
    setCurrentCompleteFilter(
      state,
      action: PayloadAction<"none" | "complete" | "incomplete">
    ) {
      state.currentCompleteFilter = action.payload;
    },
    setOnlyMinifig(state, action: PayloadAction<boolean>) {
      state.onlyMinifig = action.payload;
    },
    checkCurrentSetIsCompleted(state) {
      if (state.currentSet) {
        state.currentSet.isCompleted = isCompleted(state.allParts);
      }
    },
    cleanParts(state) {
      state.currentSet = undefined;
      state.allParts = [];
      state.statusParts = "loading";
      state.currentColors = [];
      state.currentCompleteFilter = "none";
      state.onlyMinifig = false;
    },
  },
  extraReducers(builder) {
    builder

      .addCase(fetchParts.fulfilled, (state, _action) => {
        state.statusParts = "fulfilled";
      })

      .addCase(incrementPart.fulfilled, (_state, _action) => {
        console.log("on pass dans increment");
        console.log("on pass dans increment fin");
      })
      .addCase(decrementPart.fulfilled, (_state, _action) => {
        console.log("on pass dans decrement");
      })
      .addCase(fetchParts.rejected, (_state, _action) => {});
  },
});
export type PayloadActionCollectorPart = {
  set: Set | undefined;
  part: Part;
};
const isCompleted = (parts: Part[]) => {
  const incompletedParts = parts.filter(
    (item) => item.quantityCollectorPart < item.quantityPart
  );

  return incompletedParts.length === 0;
};

export const selectSet = (state: RootState): SetState => state.set;
export const selectStatus = (state: RootState): string => state.set.statusParts;
export const selectAllParts = createSelector(
  selectSet,
  (setState) => setState.allParts
);

export const selectAllCompletedParts = createSelector(
  [selectSet, selectAllParts],
  (_state, parts) =>
    parts.filter((part) => part.quantityCollectorPart === part.quantityPart)
);
export const selectAllColors = createSelector(
  [selectSet, selectAllParts],
  (_state, parts) => {
    return parts.reduce<Color[]>((colorsTab, part) => {
      if (colorsTab.findIndex((color) => color.id === part.color.id) === -1) {
        colorsTab.push(part.color);
      }
      return colorsTab;
    }, []);
  }
);
export const selectByMiniFig = createSelector(
  [selectSet, selectAllParts],
  (state, parts) => {
    if (state.onlyMinifig) {
      return parts.filter((part) => part.isMiniFig === state.onlyMinifig);
    }
    return parts;
  }
);
export const selectPartsByColor = createSelector(
  [selectSet, selectByMiniFig],
  (state, parts) => {
    if (state.currentColors.length < 1) {
      return parts;
    } else {
      return parts.filter((part) =>
        state.currentColors.find((c: Color) => c.id === part.color.id)
      );
    }
  }
);

export const selectPartsByColorByCompleted = createSelector(
  [selectSet, selectPartsByColor],
  (state, parts) => {
    if (state.currentCompleteFilter === "complete") {
      return parts.filter(
        (part) => part.quantityCollectorPart === part.quantityPart
      );
    } else if (state.currentCompleteFilter === "incomplete") {
      return parts.filter(
        (part) => part.quantityCollectorPart < part.quantityPart
      );
    } else {
      return parts;
    }
  }
);
export const selectCurrentColors = (state: RootState): Color[] =>
  state.set.currentColors;
export const selectCurrentCompleteFilter = (
  state: RootState
): "none" | "complete" | "incomplete" => state.set.currentCompleteFilter;
export const selectMinifigFilter = (state: RootState): boolean =>
  state.set.onlyMinifig;

export const {
  setAllParts,
  checkCurrentSetIsCompleted,
  setCurrentColors,
  setCurrentCompleteFilter,
  setOnlyMinifig,
  cleanParts,
} = SetSlice.actions;

export default SetSlice.reducer;
