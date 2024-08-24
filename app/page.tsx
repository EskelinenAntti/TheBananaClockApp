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
    <main className="flex min-h-screen flex-col items-center justify-center">
      {targetDateParam ? (
        <Countdown toDate={new Date(targetDateParam)} title={title} />
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
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="mt-auto relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <h1 className="text-2xl pb-6">{title}</h1>
        <p>
          {formatDuration(timeUntil, {
            delimiter: ", ",
          })}
        </p>
      </div>
      <div className="mt-auto pb-12 flex flex-row">
        <Button
          onClick={handleCopyLink}
          variant="link"
          className="mt-auto pb-12 text-xs gap-2"
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
          className="mt-auto pb-12 text-xs"
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-xl pb-8">Create new countdown ⏲️</h1>
      <div className="grid grid-cols-[60px_auto] gap-4 pb-6 items-center">
        <Label htmlFor="title" className="justify-self-end">
          Title
        </Label>
        <Input
          id="title"
          className="w-[280px]"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Label htmlFor="time" className="justify-self-end">
          Target
        </Label>
        <DateTimePicker date={date} setDate={setDate} id="time" />
      </div>
      <Button onClick={handleCreateCountdown}>Create countdown</Button>
    </div>
  );
}
