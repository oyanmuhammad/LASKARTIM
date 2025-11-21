import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

const Pagination = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-1",
      className
    )}
    {...props}
  />
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
  isActive?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PaginationLink = React.forwardRef<HTMLButtonElement, PaginationLinkProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          : "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "h-10 w-10 [&:has(span:only-child)]:w-auto [&:has(span:only-child)]:px-3",
        className
      )}
      {...props}
    />
  )
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to previous page"
    className={cn("gap-1 pl-2.5 pr-4 w-auto", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Sebelumnya</span>
  </PaginationLink>
));
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <PaginationLink
    ref={ref}
    aria-label="Go to next page"
    className={cn("gap-1 pl-4 pr-2.5 w-auto", className)}
    {...props}
  >
    <span>Berikutnya</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
));
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn("flex h-10 w-10 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
