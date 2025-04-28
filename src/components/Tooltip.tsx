import {
  Tooltip as TooltipBox,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/__ui/tooltip";

interface Props {
  text: string | string[];
  children: React.ReactNode;
  delayDuration?: number;
}

export const Tooltip: React.FC<Props> = ({ text, children, delayDuration }) => {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipBox>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          {Array.isArray(text) ? (
            text.map((item, index) => (
              <div key={index} className="text-xs">
                {item}
              </div>
            ))
          ) : (
            <div className="text-xs">{text}</div>
          )}
        </TooltipContent>
      </TooltipBox>
    </TooltipProvider>
  );
};
