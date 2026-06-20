import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
} from "react-day-picker";

import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

/* ---------------- MOCK EVENT ---------------- */

function hasEvent(date: Date) {
  return date.getDate() % 3 === 0;
}

/* ---------------- CALENDAR ---------------- */

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = ptBR,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
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

          DayButton: CalendarDayButton,

          ...components,
        }}
        {...props}
      />
    </div>
  );
}

/* ---------------- DAY BUTTON ---------------- */

function CalendarDayButton({
  day,
  modifiers,
  className,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  const event = hasEvent(day.date);

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

      {event && (
        <span className="absolute bottom-1 left-1">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        </span>
      )}
    </Button>
  );
}

export { Calendar };