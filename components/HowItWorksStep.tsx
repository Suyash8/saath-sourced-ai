"use client";

interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
  delay?: number;
}

export function HowItWorksStep({
  step,
  title,
  description,
  delay = 0,
}: HowItWorksStepProps) {
  return (
    <div
      className="text-center group hover:scale-105 transition-transform duration-300 animate-in fade-in-0 slide-in-from-bottom-6 duration-700"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-xl group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
        {step}
      </div>
      <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {description}
      </p>
    </div>
  );
}
