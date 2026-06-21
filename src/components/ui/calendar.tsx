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
    <div
      className={cn(
        `
        bg-(image:--background-gradient)
        backdrop-blur
        text-primary-text
        border border-border
        shadow-lg
        rounded-2xl
        overflow-hidden
        `,
        className
      )}
    >
      <DayPicker
        showOutsideDays={showOutsideDays}
        locale={locale}
        className="p-4"
        captionLayout="label"
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
            inset-0
            flex
            items-center
            justify-between
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
            aspect-square
            border
            border-border/40
            bg-background/40
            hover:bg-muted/40
            transition
          `,

          today: `
            after:absolute
            after:bottom-1
            after:left-1/2
            after:-translate-x-1/2
            after:h-1
            after:w-1
            after:rounded-full
            after:bg-primary
          `,

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
    </div>
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

        data-[selected=true]:bg-primary
        data-[selected=true]:text-primary-foreground

        focus-visible:ring-2
        focus-visible:ring-primary/30
        `,
        className
      )}
      {...props}
    >
      <span className="text-xs">
        {day.date.getDate()}
      </span>

      {dayEvents.length > 0 && (
        <div className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-1">
          {dayEvents.length <= 4 ? (
            dayEvents.map((event) => (
              <div
                key={event.id}
                title={event.title}
                className="
            h-2.5
            w-2.5
            rounded-full
            bg-blue-500
            cursor-pointer
            transition-all
            hover:scale-125
            hover:bg-blue-400
          "
              />
            ))
          ) : (
            <>
              {dayEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  title={event.title}
                  className="
              h-2.5
              w-2.5
              rounded-full
              bg-blue-500
              cursor-pointer
              transition-all
              hover:scale-125
              hover:bg-blue-400
            "
                />
              ))}

              <div
                title={`${dayEvents.length} eventos`}
                className="
            flex
            items-center
            justify-center
            min-w-4
            h-4
            px-1
            rounded-full
            bg-primary
            text-[9px]
            font-semibold
            text-primary-foreground
            cursor-pointer
          "
              >
                +{dayEvents.length - 3}
              </div>
            </>
          )}
        </div>
      )}
    </Button>
  );
}

export { Calendar };
