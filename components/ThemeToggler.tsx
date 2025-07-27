"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [isRippling, setIsRippling] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleThemeToggle = () => {
    // Create ripple effect
    setIsRippling(true);

    // Get button position for ripple origin
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      // Calculate the maximum distance to cover the entire screen
      const maxDistance = Math.sqrt(
        Math.pow(Math.max(x, window.innerWidth - x), 2) +
          Math.pow(Math.max(y, window.innerHeight - y), 2)
      );

      // Create ripple element
      const ripple = document.createElement("div");
      ripple.style.position = "fixed";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "0px";
      ripple.style.height = "0px";
      ripple.style.borderRadius = "50%";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.backgroundColor =
        theme === "light" ? "hsl(222.2 84% 4.9%)" : "hsl(0 0% 100%)";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "9998";
      ripple.style.transition =
        "width 0.5s ease-out, height 0.5s ease-out, opacity 0.5s ease-out";
      ripple.style.opacity = "0";

      document.body.appendChild(ripple);

      // Trigger animation
      requestAnimationFrame(() => {
        const size = maxDistance * 2;
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.opacity = "1";
      });

      // Toggle theme after a short delay for visual effect
      setTimeout(() => {
        setTheme(theme === "light" ? "dark" : "light");
      }, 150);

      // Clean up
      setTimeout(() => {
        ripple.style.opacity = "0";
        setTimeout(() => {
          if (document.body.contains(ripple)) {
            document.body.removeChild(ripple);
          }
          setIsRippling(false);
        }, 200);
      }, 400);
    } else {
      // Fallback if button ref is not available
      setTheme(theme === "light" ? "dark" : "light");
      setIsRippling(false);
    }
  };

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleThemeToggle}
      aria-label="Toggle theme"
      className="relative overflow-hidden transition-all duration-200 hover:scale-110 active:scale-95"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>

      {/* Ripple overlay */}
      {isRippling && (
        <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
      )}
    </Button>
  );
}
