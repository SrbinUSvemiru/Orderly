import { useHeaderStore, HeaderData, Breadcrumb } from "../stores/headerStore";

export const triggerHeader = (data: HeaderData) => {
  useHeaderStore.getState().setHeaderData(data);
};

export const triggerBreadcrumb = (data: Breadcrumb) => {
  const state = useHeaderStore.getState();
  if (
    !state.headerData?.breadcrumb?.length ||
    state.headerData?.breadcrumb?.some((el) => el?.id === data?.id)
  )
    return;

  useHeaderStore.getState().setBreadcrumb(data);
};
