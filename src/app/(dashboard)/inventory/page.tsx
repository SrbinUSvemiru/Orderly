// import { useEffect } from "react";
// import { triggerHeader } from "@/lib/triggerHeader";
// import { useUserStore } from "@/stores/userStore";

import InventoryTable from "./InventoryTable";

function Inventory() {
  //   const user = useUserStore((state) => state.user);

  //   useEffect(() => {
  //     triggerHeader({
  //       title: "Clients",
  //       type: "client",
  //     });
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [user]);

  return (
    <>
      <InventoryTable />
    </>
  );
}

export default Inventory;
