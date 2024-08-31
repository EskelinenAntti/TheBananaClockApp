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
import Link from "next/link";

export function CreateMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Create <PlusIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4">
        <Link href="/bar">
          <DropdownMenuItem>Progress bar</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <Link href="/countdown">
          <DropdownMenuItem>Countdown</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
