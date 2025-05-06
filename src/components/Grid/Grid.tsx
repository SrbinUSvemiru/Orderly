import { cn } from "@/lib/utils";

import { FormItem } from "../ui/form";
import styles from "./Grid.module.css";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  columns: number;
  gap?: number;
}

interface FormGridProps {
  children: React.ReactNode;
  className?: string;
  columns: number;
  gap?: number;
  onSubmit?: () => void;
}

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  sm?: number;
  md?: number;
  lg?: number;
}

function GridItem({ children, className, sm, md, lg }: GridItemProps) {
  return (
    <div
      className={cn(
        styles.gridItem,
        styles[`col-span-${12}`],
        sm && styles[`sm:col-span-${sm}`],
        md && styles[`md:col-span-${md}`],
        lg && styles[`lg:col-span-${lg}`],
        className
      )}
    >
      {children}
    </div>
  );
}

function FormGridItem({ children, className, sm, md, lg }: GridItemProps) {
  return (
    <FormItem
      className={cn(
        styles.gridItem,
        styles[`col-span-${12}`],
        sm && styles[`sm:col-span-${sm}`],
        md && styles[`md:col-span-${md}`],
        lg && styles[`lg:col-span-${lg}`],
        className
      )}
    >
      {children}
    </FormItem>
  );
}

function Grid({ columns = 1, gap = 2, children, className }: GridProps) {
  return (
    <div
      className={cn(`w-full grid gap-${gap} grid-cols-${columns}`, className)}
    >
      {children}
    </div>
  );
}

function FormGrid({
  columns = 1,
  gap = 2,
  children,
  className,
  onSubmit,
}: FormGridProps) {
  return (
    <form
      className={cn(
        styles.formGrid,
        styles[`columns-${columns}`],
        styles[`gap-${gap}`],
        className
      )}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}

export { FormGrid, FormGridItem, Grid, GridItem };
