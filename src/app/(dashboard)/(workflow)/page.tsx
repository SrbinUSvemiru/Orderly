import { authConfig } from "@/db/auth";
import { getServerSession } from "next-auth";

async function Home() {
  const session = await getServerSession(authConfig);
  console.log(session);
  return <p>{session?.user?.email}</p>;
}

export default Home;
