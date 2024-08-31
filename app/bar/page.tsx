"use client";
import { ShareFooter } from "@/components/share-footer";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { addMonths, differenceInMilliseconds } from "date-fns";
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
    <>
      {toDateParam && fromDateParam ? (
        <Countdown
          fromDate={new Date(fromDateParam)}
          toDate={new Date(toDateParam)}
          title={title ?? ""}
        />
      ) : (
        <CountdownCreation />
      )}
    </>
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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 100);
    return () => clearInterval(interval);
  });

  const totalTime = differenceInMilliseconds(fromDate, toDate);
  const pastTime = differenceInMilliseconds(fromDate, new Date(currentMillis));

  const progress = Math.floor(
    Math.min(Math.max((100 * pastTime) / totalTime, 0), 100)
  );

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-4 flex-grow w-full">
        <h1 className="text-2xl">{title}</h1>
        <div className="flex flex-col-reverse justify-center items-end gap-1 max-w-[640px] w-full sm:flex-row sm:items-baseline sm:gap-4">
          <Progress value={progress} className="w-full" />
          <span className="text-md text-nowrap">{progress} %</span>
        </div>
      </div>
      <ShareFooter />
    </>
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
    <div className="flex flex-col items-center justify-start sm:justify-center h-full">
      <h1 className="text-xl pb-8 text-center">
        Create your own <b>progress bar</b> without going bananas.
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
      <Button onClick={handleCreateCountdown}>Create progress bar</Button>
    </div>
  );
}
