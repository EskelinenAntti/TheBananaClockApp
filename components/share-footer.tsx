"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "./ui/use-toast";

export function ShareFooter() {
  const [isCopied, setIsCopied] = useState(false);
  const handleCopyLink = () => {
    setIsCopied(true);
    toast({
      description: "Link copied to clipboard.",
    });
    navigator.clipboard.writeText(window.location.toString());
  };
  return (
    <div className="flex flex-col sm:flex-row flex-grow-0">
      <Button onClick={handleCopyLink} variant="link" className="text-xs gap-2">
        Share{" "}
        {isCopied ? (
          <CheckIcon className="w-4" />
        ) : (
          <CopyIcon className="w-4" />
        )}
      </Button>
    </div>
  );
}
