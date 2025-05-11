import {
  Avatar as Wrapper,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Avatar({ src }: { src?: string }) {
  return (
    <Wrapper>
      <AvatarImage src={src || "https://github.com/shadcn.png"} alt="@shadcn" />
      <AvatarFallback></AvatarFallback>
    </Wrapper>
  );
}
