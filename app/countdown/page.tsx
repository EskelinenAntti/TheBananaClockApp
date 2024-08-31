"use client";
import { ShareFooter } from "@/components/share-footer";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useToast } from "@/components/ui/use-toast";
import { addMonths, formatDuration, intervalToDuration } from "date-fns";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const TO_DATE_SEARCH_PARAM = "toDate";
const TITLE_SEARCH_PARAM = "title";

export default function Home() {
  const searchParams = useSearchParams();
  const targetDateParam = searchParams.get(TO_DATE_SEARCH_PARAM);
  const title = searchParams.get(TITLE_SEARCH_PARAM);

  return (
    <>
      {targetDateParam ? (
        <Countdown toDate={new Date(targetDateParam)} title={title ?? ""} />
      ) : (
        <CountdownCreation />
      )}
    </>
  );
}

function Countdown({ toDate, title }: { toDate: Date; title: string }) {
  const [currentMillis, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  });

  let timeUntil = intervalToDuration({
    start: new Date(currentMillis),
    end: toDate,
  });

  return (
    <>
      <div className="flex flex-col text-center justify-center gap-4 flex-grow">
        <h1 className="text-2xl">{title}</h1>
        <p suppressHydrationWarning>
          {formatDuration(timeUntil, {
            delimiter: ", ",
          })}
        </p>
      </div>
      <ShareFooter />
    </>
  );
}

function CountdownCreation() {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date>(addMonths(new Date(), 1));

  const handleCreateCountdown = () => {
    const params = new URLSearchParams();

    params.set(TITLE_SEARCH_PARAM, title);
    params.set(TO_DATE_SEARCH_PARAM, date.toISOString());
    // Use shallow routing to update the query parameters without triggering page load
    window.history.pushState(null, "", `?${params.toString()}`);
  };

  return (
    <div className="flex flex-col items-center bg-background h-dvh justify-start sm:justify-center">
      <h1 className="text-xl pb-8 text-center">
        Create your own <b>countdown</b> without going bananas.
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
          htmlFor="time"
          className="justify-self-start sm:justify-self-end"
        >
          Target
        </Label>
        <DateTimePicker date={date} setDate={setDate} id="time" />
      </div>
      <Button onClick={handleCreateCountdown}>Create countdown</Button>
    </div>
  );
}
