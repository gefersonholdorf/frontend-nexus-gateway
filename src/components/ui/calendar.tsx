import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card } from "./card";

import { format } from "date-fns";

function formatHour(date: string) {
  return format(new Date(date), "HH:mm");
}

interface EventI {
  id: string,
  title: string,
  startAt: string,
  endAt: string,
  organizer: {
    name: string,
    email: string
    logo?: string | null
  },
  attendees:
  {
    name: string,
    email: string,
    logo?: string | null
    response: string
  }[],
  isOnline: boolean,
  location: string,
  webLink: string
}

/* ---------------- MOCK EVENT ---------------- */

/* ---------------- CALENDAR ---------------- */

function getDayEvents(date: Date, events: EventI[]) {
  return events.filter((event) => {
    const eventDate = new Date(event.startAt);

    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });
}

function Calendar({
  className,
  events,
  classNames,
  showOutsideDays = true,
  locale = ptBR,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  events: EventI[]
}) {
  const base = getDefaultClassNames();

  return (
    <Card
      className={cn(
        `
        bg-(image:--background-gradient) p-0
        backdrop-blur
        text-primary-text
        border border-border
        shadow-lg
        overflow-hidden
        transition-all
        duration-300
        hover:shadow-xl
        `,
        className
      )}
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={locale}
        className="p-4"
        captionLayout="dropdown"
        hideNavigation={false}
        classNames={{
          root: cn("w-full", base.root),
          months: "w-full",
          month: "w-full",
          month_grid: "w-full",

          // caption: `
          //   relative
          //   flex
          //   items-center
          //   justify-center
          //   h-10
          //   mb-4
          // `,

          caption_label: `
            text-lg
            font-semibold
            capitalize
            text-foreground
          `,

          nav: `
  absolute
  top-2
  left-0
  right-0
  flex
  items-start
  justify-between
  px-2
`,

          button_previous: `
            h-9
            w-9
            rounded-full
            border
            border-border
            bg-background
            hover:bg-muted
            flex
            items-center
            justify-center
          `,

          button_next: `
            h-9
            w-9
            rounded-full
            border
            border-border
            bg-background
            hover:bg-muted
            flex
            items-center
            justify-center
          `,

          weekdays: "grid grid-cols-7",
          weekday:
            "text-center text-xs font-medium text-muted-foreground py-2",

          week: "grid grid-cols-7",

          day: `
  relative
  min-h-[110px]
  border
  border-border/40
  bg-background/40
`,

          today: '',

          outside: "text-muted-foreground/40",
          disabled: "opacity-30",
          hidden: "invisible",

          ...classNames,
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeftIcon className="size-4" />
            ) : (
              <ChevronRightIcon className="size-4" />
            ),

          MonthCaption: ({ calendarMonth }) => (
            <div className="flex items-center justify-center h-10">
              <span className="text-lg font-semibold capitalize">
                {calendarMonth.date.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          ),

          DayButton: (props) => (
            <CalendarDayButton
              {...props}
              events={events}
            />
          ),

          ...components,
        }}
        {...props}
      />
    </Card>
  );
}

/* ---------------- DAY BUTTON ---------------- */

interface CalendarDayButtonProps
  extends React.ComponentProps<typeof DayButton> {
  events: EventI[];
}

function CalendarDayButton({
  day,
  modifiers,
  events,
  className,
  ...props
}: CalendarDayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  const dayEvents = getDayEvents(day.date, events);

  const isSelected =
    modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  const isToday = modifiers.today;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-selected={isSelected}
      className={cn(
        `
  relative
  w-full
  h-full
  rounded-none
  flex
  items-start
  justify-start
  p-1
  text-sm
  font-medium

  hover:bg-muted/50

  data-[selected=true]:bg-primary/10
  data-[selected=true]:text-primary-foreground

  focus-visible:ring-2
  focus-visible:ring-primary/30
  `,
        isToday &&
        !isSelected &&
        "bg-primary/10",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors",
          isToday &&
          !isSelected &&
          "bg-primary text-primary-foreground font-semibold",
          isSelected &&
          "bg-primary-foreground text-primary font-semibold"
        )}
      >
        {day.date.getDate()}
      </span>

      {dayEvents.length > 0 && (
        <div
          className="
      absolute
      top-8
      left-1
      right-1
      flex
      flex-col
      gap-1
    "
        >
          {dayEvents.slice(0, 2).map((event) => (
            <div
              key={event.id}
              className="
          flex
          items-center
          gap-1
          rounded-md
          px-1
          py-0.5
          bg-primary/5
          hover:bg-primary/10
          text-[10px]
          truncate
        "
              title={event.title}
            >
              <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />

              <span className="font-medium shrink-0">
                {formatHour(event.startAt)}
              </span>

              <span className="truncate">
                {event.title}
              </span>
            </div>
          ))}

          {dayEvents.length > 2 && (
            <span
              className="
          text-[10px]
          text-muted-foreground
          px-1
        "
            >
              +{dayEvents.length - 2} eventos
            </span>
          )}
        </div>
      )}
    </Button>
  );
}

export { Calendar };
