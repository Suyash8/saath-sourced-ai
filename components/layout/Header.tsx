import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  title: string | ReactNode;
  subtitle?: string;
  variant?: "dashboard" | "page";
  backHref?: string;
  children?: ReactNode;
  className?: string;
};

export const IconButton = ({
  href,
  icon: Icon,
  className,
}: {
  href: string;
  icon: React.ElementType;
  className?: string;
}) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn("h-8 w-8 md:h-12 md:w-12", className)}
    asChild
  >
    <Link href={href} aria-label="Go back">
      <Icon className="!h-5 !w-5 md:!h-6 md:!w-6" />
    </Link>
  </Button>
);

export const Header = ({
  title,
  subtitle,
  variant = "page",
  backHref,
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 md:h-20">
          <div className="flex items-center gap-3 md:gap-4">
            {backHref && (
              <IconButton href={backHref} icon={ArrowLeft} className="-ml-2" />
            )}

            <div>
              <h1
                className={cn(
                  "font-semibold tracking-tight",
                  variant === "dashboard"
                    ? "text-lg md:text-2xl"
                    : "text-base md:text-xl"
                )}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {children && (
            <div className="flex items-center gap-3 md:gap-4">{children}</div>
          )}
        </div>
      </div>
    </header>
  );
};
