"use client";

import { CheckCircle } from "lucide-react";

interface BenefitItemProps {
  title: string;
  description: string;
}

export function BenefitItem({ title, description }: BenefitItemProps) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
