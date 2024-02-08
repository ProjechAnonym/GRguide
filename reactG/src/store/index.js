import { configureStore } from "@reduxjs/toolkit";
import { identitySlice } from "../slice/identitySlice";
import { styleSlice } from "../slice/styleSlice";
export default configureStore({
  reducer: { identity: identitySlice.reducer, style: styleSlice.reducer },
});
