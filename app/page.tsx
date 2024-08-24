"use client";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "@radix-ui/react-icons";
import { addMonths, formatDuration, intervalToDuration } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const searchParams = useSearchParams();
  const targetDateParam = searchParams.get("toDate");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {targetDateParam ? (
        <Countdown toDate={new Date(targetDateParam)} />
      ) : (
        <CountdownCreation />
      )}
    </main>
  );
}

function Countdown({ toDate }: { toDate: Date }) {
  const [currentMillis, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  });

  const handleCreateNewCountdownClicked = () => {
    window.history.pushState(null, "", "/");
  };

  const targetDate = toDate;
  let timeUntil = intervalToDuration({
    start: new Date(currentMillis),
    end: targetDate,
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="mt-auto relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        {formatDuration(timeUntil, {
          delimiter: ", ",
        })}
      </div>
      <Button
        onClick={handleCreateNewCountdownClicked}
        variant="link"
        size="icon"
        className="mt-auto pb-12"
      >
        <span className="text-xs">Create new countdown</span>
      </Button>
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
      <div className="flex flex-col gap-6 pb-6 items-center justify-center">
        <div className="flex flex-row items-baseline gap-4">
          <Label htmlFor="title" className="pb-2">
            Title
          </Label>
          <Input
            id="title"
            className="w-64"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-row items-baseline gap-4">
          <Label htmlFor="time" className="pb-2">
            Target
          </Label>
          <DateTimePicker date={date} setDate={setDate} id="time" />
        </div>
      </div>
      <Button onClick={handleCreateCountdown}>Create countdown!</Button>
    </div>
  );
}
