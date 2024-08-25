"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addMonths, formatDuration, intervalToDuration, set } from "date-fns";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const targetDateParam = searchParams.get("toDate");
  const title = searchParams.get("title");

  return (
    <main className="flex flex-col h-dvh items-center p-4">
      {targetDateParam ? (
        <Countdown toDate={new Date(targetDateParam)} title={title ?? ""} />
      ) : (
        <CountdownCreation />
      )}
    </main>
  );
}

function Countdown({ toDate, title }: { toDate: Date; title: string }) {
  const [currentMillis, setNow] = useState(Date.now());
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  });

  const handleCreateNewCountdownClicked = () => {
    window.history.pushState(null, "", "/");
  };

  const handleCopyLink = () => {
    setIsCopied(true);
    toast({
      description: "Link copied to clipboard.",
    });
    navigator.clipboard.writeText(window.location.toString());
  };

  const targetDate = toDate;
  let timeUntil = intervalToDuration({
    start: new Date(currentMillis),
    end: targetDate,
  });

  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <div className="flex flex-col text-center justify-center gap-4 flex-grow">
        <h1 className="text-2xl">{title}</h1>
        <p>
          {formatDuration(timeUntil, {
            delimiter: ", ",
          })}
        </p>
      </div>
      <div className="flex flex-row flex-grow-0">
        <Button
          onClick={handleCopyLink}
          variant="link"
          className="text-xs gap-2"
        >
          Share{" "}
          {isCopied ? (
            <CheckIcon className="w-4" />
          ) : (
            <CopyIcon className="w-4" />
          )}
        </Button>
        <Button
          onClick={handleCreateNewCountdownClicked}
          variant="link"
          className="text-xs"
        >
          Create new countdown
        </Button>
      </div>
    </div>
  );
}

function CountdownCreation() {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date>(addMonths(new Date(), 1));

  const handleCreateCountdown = () => {
    const params = new URLSearchParams();

    params.set("title", title);
    params.set("toDate", date.toISOString());
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center bg-background h-dvh justify-start sm:justify-center ">
      <h1 className="text-xl pb-8">Create new countdown ⏲️</h1>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 pb-6 items-center">
        <Label
          htmlFor="title"
          className="justify-self-start sm:justify-self-end"
        >
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Label
          htmlFor="time"
          className="sm:justify-self-start md:justify-self-end"
        >
          Target
        </Label>
        <DateTimePicker date={date} setDate={setDate} id="time" />
      </div>
      <Button onClick={handleCreateCountdown}>Create countdown</Button>
    </div>
  );
}
