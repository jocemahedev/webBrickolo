import { combineReducers } from "@reduxjs/toolkit";

import collectorReducer from "./collector";
import collectionReducer from "./collection";
import setReducer from "./set";
import { rebrickableApi } from "./services/rebrickable/rebrickable.web";

const rootReducer = combineReducers({
  collector: collectorReducer,
  collection: collectionReducer,
  set: setReducer,
  [rebrickableApi.reducerPath]: rebrickableApi.reducer,
});

export default rootReducer;
