import Link from "next/link";
import React from "react";

interface IconButtonProps {
  href: string;
  icon: React.ElementType;
  className?: string;
  badgeCount?: number;
}

export function IconButton({
  href,
  icon: Icon,
  className,
  badgeCount = 0,
}: IconButtonProps) {
  return (
    <Link href={href} className={`relative p-2 rounded-full ${className}`}>
      <Icon className="h-6 w-6" />
      {badgeCount > 0 && (
        <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-background">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}
