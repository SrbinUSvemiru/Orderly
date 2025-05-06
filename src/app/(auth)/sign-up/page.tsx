import { getCurrentUnix } from "@/lib/date";
import { verifyToken } from "@/lib/encryption";

import { RegisterClientForm } from "./RegisterClientForm";
import { RegisterUserForm } from "./RegisterUserForm";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function SignUp(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const token = params.token;

  const data = await verifyToken(token || "");
  let isTokenExpired = true;
  const organisationId = data?.organizationId || "";
  if (data?.exp) {
    isTokenExpired = data?.exp > getCurrentUnix();
  }

  if (isTokenExpired)
    return (
      <p className="text-4xl dark:text-red-400 text-red-600 ml-3.5">
        Token has expiered
      </p>
    );

  if (organisationId) return <RegisterUserForm token={data} />;
  return <RegisterClientForm token={data} />;
}

export default SignUp;
