import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

export function Avatar({ name, src, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={40}
        height={40}
        className={cn("h-10 w-10 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary",
        className,
      )}
    >
      {initials || "--"}
    </span>
  );
}
