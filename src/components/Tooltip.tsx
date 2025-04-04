import {
  TooltipProvider,
  Tooltip as TooltipBox,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface Props {
  text: string,
  children: React.ReactNode;
}

export const Tooltip: React.FC<Props> = ({ text, children }) => {
  return (
    <TooltipProvider>
      <TooltipBox>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </TooltipBox>
    </TooltipProvider>
  );
};
