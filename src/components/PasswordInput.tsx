import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "./ui/button";

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [state, setState] = React.useState(false);
  return (
    <div className="flex items-center space-x-1">
      <input
        type={state ? "text" : "password"}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-white dark:bg-neutral-900 px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />

      <Button
        variant="outline"
        className="bg-white dark:bg-neutral-900"
        onClick={(e) => {
          e.preventDefault();
          setState(!state);
        }}
      >
        {state ? (
          <EyeOffIcon className="text-accent-foreground/70" />
        ) : (
          <EyeIcon className="text-accent-foreground/70" />
        )}
      </Button>
    </div>
  );
}

export { PasswordInput };
