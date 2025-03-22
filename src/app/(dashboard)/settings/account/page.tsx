import { AccountForm } from "@/components/AccountForm";
import { getServerSession } from "next-auth";
import { authConfig } from "@/db/auth";

async function Account() {
  const session = await getServerSession(authConfig);
  const user = await fetch(
    `http://localhost:3000/api/users/${session?.user.id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const response = await user.json();
  return <AccountForm user={response} />;
}

export default Account;
