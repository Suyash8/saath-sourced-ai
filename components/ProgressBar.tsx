interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showText?: boolean;
  label?: string;
}

export const ProgressBar = ({
  value,
  max = 100,
  className = "",
  showText = true,
  label,
}: ProgressBarProps) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || showText) && (
        <div className="flex justify-between items-center text-sm">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showText && (
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
