import {
  PayloadAction,
  createSlice,
  createSelector,
  createAsyncThunk,
  nanoid,
} from "@reduxjs/toolkit";
import { Set, Collection, Part, IncompleteParts } from "../../types/types";
import { db } from "../services/firebase/firebaseConfig";
import {
  ref,
  set,
  remove,
  get,
  query,
  push,
  DatabaseReference,
  update,
} from "firebase/database";
import { AppDispatch, RootState } from "..";
import { RebrickableSet } from "../services/rebrickable/type";
import { rebrickableApi } from "../services/rebrickable/rebrickable.web";

export type CollectionState = {
  currentCollection: Collection | undefined;
  allSets: Set[];
  currentSetIndex: number | undefined;
  addSetStatus: "none" | "pending" | "fulfilled" | "rejected";
  incompleteParts: IncompleteParts[];
};
export const initialState: CollectionState = {
  currentCollection: {
    id: "1",
    idSets: "12345",
  },
  allSets: [],
  currentSetIndex: undefined,
  addSetStatus: "none",
  incompleteParts: [],
};

export const fetchSets = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>("collection/fetchSets", async (_, { getState, dispatch }) => {
  const rootState = getState();
  const idSets = rootState.collection.currentCollection?.idSets;
  const dbRef = ref(db, "/collections/" + idSets);
  const dataSnapshot = await get(query(dbRef));
  const values: Set[] = dataSnapshot.val();
  let datas: Set[] = [];
  for (const data in values) {
    datas.push(values[data]);
  }
  dispatch(setCurrentSets(datas));
});
export const updateQuantitySet = createAsyncThunk<void, number>(
  "collection/updateQuantitySet",
  async (quantity, { getState }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const currentSet = selectCurrentSet(rootState);
    const idSet = currentSet?.id;
    const dbRef = ref(db, "/collections/" + idSets + "/" + idSet);
    await updateSet(dbRef, quantity);
  }
);
const updateSet = async (dbRef: DatabaseReference, quantity: number) => {
  await update(dbRef, { quantityCollectorParts: quantity });
};
const collectionSlice = createSlice({
  name: "collection",
  initialState: initialState,
  reducers: {
    setCurrentCollection(state, action: PayloadAction<Collection>) {
      state.currentCollection = action.payload;
    },
    setCurrentSets(state, action: PayloadAction<Set[]>) {
      state.allSets = action.payload;
      state.addSetStatus = "none";
    },
    setAddSetStatus(
      state,
      action: PayloadAction<"none" | "pending" | "fulfilled" | "rejected">
    ) {
      state.addSetStatus = action.payload;
    },
    setIncompleteParts(state, action: PayloadAction<IncompleteParts[]>) {
      console.log("on set incomplete parts");
      state.incompleteParts = action.payload;
    },
    setCurrentIndexSet(state, action: PayloadAction<Set>) {
      const payloadSet = action.payload;
      state.currentSetIndex = state.allSets.findIndex(
        (item) => item.id === payloadSet.id
      );
      console.log(state.currentSetIndex);
    },
    updateQuantityCurrentSet: (state, action: PayloadAction<number>) => {
      const currentIndex = state.currentSetIndex;
      if (currentIndex !== undefined) {
        state.allSets[currentIndex].quantityCollectorParts = action.payload;
      }
    },
    addSetToCollection(state, action: PayloadAction<Set>) {
      state.allSets = [...state.allSets, action.payload];
    },
    deleteSetToCollection(state, action: PayloadAction<string>) {
      state.allSets = state.allSets.filter((item) => {
        return item.id !== action.payload;
      });
    },
    cleanMissingParts(state) {
      state.incompleteParts = [];
    },
    cleanSets(state) {
      state.allSets = [];
      state.currentSetIndex = undefined;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addSet.pending, (state, _action) => {
        state.addSetStatus = "pending";
      })
      .addCase(addSet.rejected, (state, _action) => {
        state.addSetStatus = "rejected";
      })
      .addCase(addSet.fulfilled, (state, _action) => {
        state.addSetStatus = "fulfilled";
      })
      .addCase(getIncompleteParts.fulfilled, (state, _action) => {
        console.log("on est fullfilled");
      });
  },
});
export const deleteSet = createAsyncThunk<void, string>(
  "collection/deleteSet",
  async (idSet, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    const currentCollection = rootState.collection.currentCollection;
    if (currentCollection) {
      const idSets = currentCollection.idSets;
      const dbRef = ref(db, "/collections/" + idSets + "/" + idSet);
      await remove(dbRef);
      dispatch(deleteSetToCollection(idSet));
    }
  }
);
export const deleteParts = createAsyncThunk<void, string>(
  "collection/deleteParts",
  async (idParts, { getState }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const dbRef = ref(db, "/parts/" + idSets + "/"+ idParts);
    await remove(dbRef);
  }
);
export const getIncompleteParts = createAsyncThunk<void, Set[]>(
  "collection/getIncompleteParts",
  async (allSets, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const dbRef = ref(db, "/parts/" + idSets);
    let missingParts: IncompleteParts[] = [];
    await get(query(dbRef))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("🟢 snapshot");
          console.log(snapshot.val());
          const obj = snapshot.val();
          Object.entries(obj).map(([key, values]) => {
            const parts: Part[] = values;
            const missingPartsSet = parts.filter(
              (value) => value.quantityCollectorPart < value.quantityPart
            );
            const oneSet: Set = allSets.filter((oneSet) => oneSet.idParts == key)[0];
            if (missingPartsSet.length > 0 && oneSet) {
              const oneMissingParts: IncompleteParts = {
                set: oneSet,
                data: missingPartsSet,
              };
              missingParts = [...missingParts, oneMissingParts];
            }
          });
        }
      })
      .then(() => {
        console.log("on finish him");
        console.log("☣️ missing parts ending");
        console.log(missingParts);
        dispatch(setIncompleteParts(missingParts));
      });
  }
);
export const completeSet = createAsyncThunk<void, Set>(
  "collection/completeSet",
  async (setToBeCompleted, { getState, dispatch }) => {
    setToBeCompleted;
    const rootState = getState() as RootState;
    const idSets = rootState.collection.currentCollection?.idSets;
    const dbRef = ref(db, "/parts/" + idSets + "/" + setToBeCompleted.idParts);
    await get(query(dbRef))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const values: Part[] = snapshot.val();
          values.forEach((value) => {
            value.quantityCollectorPart = value.quantityPart;
          });
          console.log("values");
          console.log(values);
          set(dbRef, values);
          dispatch(updateQuantitySet(setToBeCompleted.quantityParts));
          dispatch(setCurrentIndexSet(setToBeCompleted));
          dispatch(updateQuantityCurrentSet(setToBeCompleted.quantityParts));
        } else {
          console.log(
            "No data available for " +
              setToBeCompleted.idLego +
              " " +
              setToBeCompleted.id
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

export const addSet = createAsyncThunk<void, RebrickableSet>(
  "collection/addSet",
  async (rebrickableSet: RebrickableSet, { getState, dispatch }) => {
    const rootState = getState() as RootState;
    const idCollection = rootState.collection.currentCollection?.id;
    const idSets = rootState.collection.currentCollection?.idSets;
    const collections = ref(db, "/collections/" + idSets);
    const newCollectionsRef = push(collections);
    const newSet: Set = {
      idCollection: <string>idCollection,
      id: <string>newCollectionsRef.key,
      name: rebrickableSet.name,
      imageUrl: rebrickableSet.set_img_url,
      isCompleted: false,
      quantityParts: rebrickableSet.num_parts,
      quantityCollectorParts: 0,
      idParts: nanoid(),
      idLego: rebrickableSet.set_num,
    };
    set(newCollectionsRef, newSet);
    dispatch(addSetToCollection(newSet));
    dispatch(setCurrentIndexSet(newSet));

    dispatch(rebrickableApi.endpoints.getPartsByIdLego.initiate(newSet.idLego));
  }
);

export const selectCollection = (state: RootState): CollectionState =>
  state.collection;

export const selectCurrentCollection = (
  state: RootState
): Collection | undefined => state.collection.currentCollection;
export const selectCurrentSetIndex = (state: RootState): number | undefined =>
  state.collection.currentSetIndex;
export const selectAllSets = createSelector(
  selectCollection,
  (collectionState) => collectionState.allSets
);

export const selectCompletedSets = createSelector([selectAllSets], (sets) =>
  sets.filter((set) => set.isCompleted)
);

export const selectSetById = (state: RootState, set: Set) =>
  state.collection.allSets.find((item) => set.id === item.id);

export const countSets = (state: RootState): number =>
  state.collection.allSets.length;

export const selectAddSetStatus = (
  state: RootState
): "none" | "pending" | "fulfilled" | "rejected" =>
  state.collection.addSetStatus;

export const selectCurrentSet = (state: RootState): Set | undefined => {
  const index = state.collection.currentSetIndex;
  if (index !== undefined) {
    return state.collection.allSets[index];
  }
  return undefined;
};
export const selectIncompleteParts = (state: RootState): IncompleteParts[] => {
  return state.collection.incompleteParts;
};

export const {
  setCurrentCollection,
  setCurrentSets,
  setCurrentIndexSet,
  setIncompleteParts,
  updateQuantityCurrentSet,
  addSetToCollection,
  deleteSetToCollection,
  setAddSetStatus,
  cleanSets,
} = collectionSlice.actions;

export default collectionSlice.reducer;
