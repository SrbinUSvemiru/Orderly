import { authConfig } from "@/db/auth";
import { getServerSession } from "next-auth";

async function Workflows() {
  const session = await getServerSession(authConfig);

  return (
    <>
      <p>Welcome back {session?.user?.name}</p>
    </>
  );
}

export default Workflows;
