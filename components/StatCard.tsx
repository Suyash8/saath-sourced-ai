"use client";

interface StatCardProps {
  value: string;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center group hover:scale-110 transition-transform duration-300">
      <div className="text-3xl font-bold text-primary mb-2 group-hover:scale-125 transition-transform duration-300">
        {value}
      </div>
      <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
        {label}
      </div>
    </div>
  );
}
