// Clerk
import { UserButton } from "@clerk/nextjs";

// Theme toggle
import ThemeToggle from "@/components/shared/theme-toggle";

export default function Header() {
  return (
    <div className="fixed z-[20] md:left-[300px] left-0 top-0 right-0 p-4 bg-background/80 backdrop-blur-md flex gap-4 items-center border-b-[1px]">
      <div className="flex items-center gap-2 ml-auto">
        <UserButton afterSignOutUrl="/" />
        <ThemeToggle />
      </div>
    </div>
  );
}
