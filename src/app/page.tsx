import ThemeToggle from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="p-5">
      <div className="w-100 flex justify-end">
        <ThemeToggle />
      </div>
      <h1 className=" text-blue-500 font-barlow">Welcome to the course !</h1>
      <Button>Click here</Button>
    </div>
  );
}
