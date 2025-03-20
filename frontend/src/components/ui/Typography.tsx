import React from "react";
import { cn } from "../../lib/utils";

const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn("", className)} {...props} />
));
Heading.displayName = "Heading";

const SubHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("", className)} {...props} />
));
SubHeading.displayName = "SubHeading";

const Paragraph = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("", className)} {...props} />
));
Paragraph.displayName = "Paragraph";

export { Heading, SubHeading, Paragraph };
