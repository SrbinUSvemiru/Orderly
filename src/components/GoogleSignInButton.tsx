import { FC, ReactNode } from "react";

import { Button } from "./__ui/button";

interface GoogleSignInButtonProps {
  children: ReactNode;
}

const GoogleSignInButton: FC<GoogleSignInButtonProps> = ({ children }) => {
  const login = () => console.log("google");

  return (
    <Button onClick={login} className="w-full">
      {children}
    </Button>
  );
};

export default GoogleSignInButton;
