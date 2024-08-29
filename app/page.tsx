"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  addMonths,
  differenceInMilliseconds,
  formatDuration,
  intervalToDuration,
} from "date-fns";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const FROM_DATE_SEARCH_PARAM = "fromDate";
const TO_DATE_SEARCH_PARAM = "toDate";
const TITLE_SEARCH_PARAM = "title";

export default function Home() {
  const searchParams = useSearchParams();
  const fromDateParam = searchParams.get(FROM_DATE_SEARCH_PARAM);
  const toDateParam = searchParams.get(TO_DATE_SEARCH_PARAM);
  const title = searchParams.get(TITLE_SEARCH_PARAM);

  return (
    <main className="flex flex-col h-dvh items-center p-4 gap-8">
      <ModeToggle className="self-end" />
      {toDateParam && fromDateParam ? (
        <Countdown
          fromDate={new Date(fromDateParam)}
          toDate={new Date(toDateParam)}
          title={title ?? ""}
        />
      ) : (
        <CountdownCreation />
      )}
    </main>
  );
}

function Countdown({
  fromDate,
  toDate,
  title,
}: {
  fromDate: Date;
  toDate: Date;
  title: string;
}) {
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

  // TODO: We might not need this
  const timeUntil = intervalToDuration({
    start: new Date(currentMillis),
    end: toDate,
  });

  const totalTime = differenceInMilliseconds(fromDate, toDate);
  const pastTime = differenceInMilliseconds(fromDate, new Date(currentMillis));

  const progress = Math.floor(
    Math.min(Math.max((100 * pastTime) / totalTime, 0), 100)
  );

  return (
    <div className="flex flex-col justify-center items-center flex-grow w-full">
      <div className="flex flex-col justify-center items-center gap-4 flex-grow w-full">
        <h1 className="text-2xl">{title}</h1>
        <div className="flex flex-col-reverse justify-center items-end gap-1 max-w-[640px] w-full sm:flex-row sm:items-baseline sm:gap-4">
          <Progress value={progress} className="w-full" />
          <span className="text-md text-nowrap">{progress} %</span>
        </div>
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
          Create progress bar
        </Button>
      </div>
    </div>
  );
}

function CountdownCreation() {
  const [title, setTitle] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(addMonths(new Date(), 1));

  const handleCreateCountdown = () => {
    const params = new URLSearchParams();

    params.set(TITLE_SEARCH_PARAM, title);
    params.set(FROM_DATE_SEARCH_PARAM, fromDate.toISOString());
    params.set(TO_DATE_SEARCH_PARAM, toDate.toISOString());
    // Use shallow routing to update the query parameters without triggering page load
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center bg-background h-dvh justify-start sm:justify-center">
      <h1 className="text-xl pb-8 text-center">
        Create your own progress bar without going bananas.
      </h1>
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
          htmlFor="fromDate"
          className="justify-self-start sm:justify-self-end"
        >
          From
        </Label>
        <DateTimePicker date={fromDate} setDate={setFromDate} id="fromDate" />
        <Label
          htmlFor="toDate"
          className="justify-self-start sm:justify-self-end"
        >
          To
        </Label>
        <DateTimePicker date={toDate} setDate={setToDate} id="toDate" />
      </div>
      <Button onClick={handleCreateCountdown}>Create countdown</Button>
    </div>
  );
}
