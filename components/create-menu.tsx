"use client";
import { PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export function CreateMenu() {
  const handleCreateNewCountdownClicked = () => {
    window.history.pushState(null, "", "/");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Create <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <DropdownMenuItem onClick={handleCreateNewCountdownClicked}>
          Progress bar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Countdown</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
