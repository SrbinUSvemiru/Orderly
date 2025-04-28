"use client";

import { upperFirst } from "lodash";
import { useTheme } from "next-themes";
import * as React from "react";

import { Label } from "./__ui/label";
import { Switch } from "./__ui/switch";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center space-x-3">
      <Label htmlFor="theme-mode" className="space-x-3">
        <span>Theme mode:</span> <span>{upperFirst(theme)}</span>
      </Label>
      <Switch
        id="theme-mode"
        checked={theme === "dark"}
        className="cursor-pointer"
        onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
      />
    </div>
  );
}
