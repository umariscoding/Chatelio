// Base Card component
import React from "react";

import type { CardProps } from "@/interfaces/Card.interface";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    const baseClasses =
      "rounded-lg border border-border-light bg-bg-primary text-text-primary shadow-md";
    const classes = `${baseClasses} ${className || ""}`;

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export default Card;
