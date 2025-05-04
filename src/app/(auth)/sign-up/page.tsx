import { getCurrentUnix } from "@/lib/date";
import { verifyToken } from "@/lib/encryption";

import { RegisterForm } from "./RegisterForm";

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function SignUp(props: { searchParams: SearchParams }) {
  const params = await props.searchParams;
  const token = params.token;

  const data = await verifyToken(token || "");
  let isTokenExpired = true;
  if (data?.exp) {
    isTokenExpired = data?.exp > getCurrentUnix();
  }

  if (isTokenExpired)
    return (
      <p className="text-4xl dark:text-red-400 text-red-600 ml-3.5">
        Token has expiered
      </p>
    );
  return <RegisterForm token={data} />;
}

export default SignUp;
