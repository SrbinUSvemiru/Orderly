"use client";
import { useState } from "react";
import {
  Avatar as Wrapper,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export default function Avatar() {
  const [src] = useState("https://github.com/shadcn.png");
  return (
    <Wrapper>
      <AvatarImage src={src} alt="@shadcn" />
      <AvatarFallback></AvatarFallback>
    </Wrapper>
  );
}
