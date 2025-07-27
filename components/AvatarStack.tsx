import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface AvatarStackProps {
  users: User[];
  max?: number;
  className?: string;
}

export const AvatarStack = ({
  users,
  max = 3,
  className = "",
}: AvatarStackProps) => {
  const displayUsers = users.slice(0, max);
  const remainingCount = users.length > max ? users.length - max : 0;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      {displayUsers.map((user) => (
        <Avatar key={user.id} className="h-8 w-8 border-2 border-background">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingCount > 0 && (
        <Avatar className="h-8 w-8 border-2 border-background bg-muted">
          <AvatarFallback className="text-xs text-muted-foreground">
            +{remainingCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
