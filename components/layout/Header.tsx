import { ReactNode } from "react";
import { ArrowLeft, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

type HeaderProps = {
  title: string | ReactNode;
  subtitle?: string;
  variant?: "dashboard" | "page";
  onBackClick?: () => void;
  children?: ReactNode;
  className?: string;
};

export const Header = ({
  title,
  subtitle,
  variant = "page",
  onBackClick,
  children,
  className,
}: HeaderProps) => {
  return (
    <header
      className={cn(
        "bg-card border-b border-border sticky top-0 z-10",
        className
      )}
    >
      {/* 
        We add a container to manage horizontal padding and max-width on larger screens.
        This prevents the header from stretching too wide on desktop.
      */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          {/* Left Side of the Header */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Conditionally render the Back Button if onBackClick is provided */}
            {onBackClick && (
              <button
                onClick={onBackClick}
                className="p-1 -ml-1 md:p-2 md:-ml-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
              </button>
            )}

            {/* Text Content */}
            <div>
              {/* Apply responsive text sizes based on the 'variant' prop */}
              <h1
                className={cn(
                  "font-semibold tracking-tight",
                  variant === "dashboard"
                    ? "text-lg md:text-2xl" // Larger on mobile, even larger on desktop
                    : "text-base md:text-xl" // Standard on mobile, larger on desktop
                )}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {/* Hide subtitle on very small screens to save space, show on sm and up */}
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Right Side of the Header (for children like icons) */}
          {children && (
            <div className="flex items-center gap-3 md:gap-4">{children}</div>
          )}
        </div>
      </div>
    </header>
  );
};
