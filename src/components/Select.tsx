import { map } from "lodash";

import { cn } from "@/lib/utils";

import { FormControl } from "./ui/form";
import {
  Select as SelectProvider,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Props {
  className?: string;
  placeholder?: string;
  items: { value: string; label: string }[];
  onValueChange: () => void;
  defaultValue: string;
}

function FormSelect({
  className,
  items,
  placeholder,
  onValueChange,
  defaultValue,
}: Props) {
  return (
    <SelectProvider onValueChange={onValueChange} defaultValue={defaultValue}>
      <FormControl>
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {map(items || [], (el) => (
          <SelectItem key={el?.value} value={el?.value}>
            {el?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectProvider>
  );
}

export { FormSelect };
