import { Button } from "@/components/ui/button";
import {
  Dialog as DialogProvider,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type InputField = {
  label: string;
  name: string;
};

interface DialogProps {
  button: { title: string };
  title: string;
  description: string;
  inputs: InputField[];
  submitButton: { title: string; onClick?: () => void };
}

export function Dialog({ props }: { props: DialogProps }) {
  return (
    <DialogProvider>
      <DialogTrigger asChild>
        <Button variant="outline">{props.button.title}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {props.inputs.map((el) => (
            <div className="grid grid-cols-4 items-center gap-4" key={el.name}>
              <Label htmlFor="name" className="text-right">
                {el?.label}
              </Label>
              <Input
                id={el?.name}
                value="Pedro Duarte"
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={() =>
              props.submitButton.onClick ? props.submitButton.onClick() : {}
            }
          >
            {props.submitButton.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogProvider>
  );
}
