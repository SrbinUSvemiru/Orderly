import { useHeaderStore, HeaderData } from "../stores/headerStore";

export const triggerHeader = (data: HeaderData) => {
  useHeaderStore.getState().setHeaderData(data);
};
