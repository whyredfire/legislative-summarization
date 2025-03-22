import React, { ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
}

export default function GradientText({
  children,
  className = "",
  colors = ["#ffaa40", "#9c40ff", "#ffaa40"],
  animationSpeed = 8,
}: GradientTextProps) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    animation: `gradient ${animationSpeed}s ease infinite`,
  };

  return (
    <div className={`relative mx-auto flex max-w-fit ${className}`}>
      <div className="text-transparent" style={gradientStyle}>
        {children}
      </div>
    </div>
  );
}
