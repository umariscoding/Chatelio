"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width = "100%",
  height = "1rem",
  rounded = false,
  animate = true,
}) => {
  const baseClasses = "bg-secondary-200";
  const animationClasses = animate ? "animate-pulse" : "";
  const roundedClasses = rounded ? "rounded-full" : "rounded";

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${animationClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
