import { authConfig } from "@/db/auth";
import { getServerSession } from "next-auth";

async function Workflows() {
  const session = await getServerSession(authConfig);

  return <p>{session?.user?.email}</p>;
}

export default Workflows;
