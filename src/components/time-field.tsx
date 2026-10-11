"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addMinutes,
  formatTimeValue,
  parseTimeValue,
} from "@/lib/time";

type TimeFieldProps = {
  value: Date;
  onChange: (next: Date) => void;
};

export function TimeField({ value, onChange }: TimeFieldProps) {
  const [draft, setDraft] = useState(() => formatTimeValue(value));

  function nudge(minutes: number) {
    const next = addMinutes(value, minutes);
    onChange(next);
    setDraft(formatTimeValue(next));
  }

  function handleText(raw: string) {
    setDraft(raw);
    const parsed = parseTimeValue(raw);
    if (parsed) onChange(parsed);
  }

  function handleBlur() {
    const parsed = parseTimeValue(draft);
    if (parsed) {
      setDraft(formatTimeValue(parsed));
      return;
    }
    setDraft(formatTimeValue(value));
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => nudge(-15)}
          aria-label="15 minutes earlier"
        >
          <Minus />
          15
        </Button>
        <Input
          id="order-time"
          name="readyBy"
          inputMode="numeric"
          autoComplete="off"
          spellCheck={false}
          placeholder="12:15"
          className="h-9 flex-1 text-center font-medium tabular-nums"
          value={draft}
          onChange={(event) => handleText(event.target.value)}
          onBlur={handleBlur}
          aria-label="Ready by time"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => nudge(15)}
          aria-label="15 minutes later"
        >
          <Plus />
          15
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Type a time (16:30) or nudge ±15 min. We’ll heat it for then.
      </p>
    </div>
  );
}
