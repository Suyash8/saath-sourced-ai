import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const sizeMap = {
  xs: { width: 50, height: 17 },
  sm: { width: 80, height: 27 },
  md: { width: 120, height: 40 },
  lg: { width: 160, height: 53 },
};

type LogoProps = {
  size?: keyof typeof sizeMap;
  className?: string;
  href?: string;
};

export const SaathiLogo = ({
  size = "sm",
  className,
  href = "/",
}: LogoProps) => {
  const { width, height } = sizeMap[size];

  const logoImage = (
    <Image
      src="/logo.png"
      alt="SaathiAI Logo"
      width={width}
      height={height}
      className="object-contain rounded-lg"
    />
  );

  return (
    <div className={cn("flex justify-center", className)}>
      <Link href={href} aria-label="Go to homepage">
        {logoImage}
      </Link>
    </div>
  );
};
