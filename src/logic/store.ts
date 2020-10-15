import { configureStore } from "@reduxjs/toolkit";
import { documentExplorerSlice } from "./documentExplorerSlice";

export const store = configureStore(documentExplorerSlice);