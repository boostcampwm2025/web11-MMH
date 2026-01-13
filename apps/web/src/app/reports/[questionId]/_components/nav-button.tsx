import Link from "next/link";
import { Button } from "@/components/button/button";

interface NavButtonProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "outline";
}

function NavButton({ href, icon, children, variant }: NavButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      className="flex-1 h-11 font-bold rounded-xl"
    >
      <Link href={href}>
        {icon}
        {children}
      </Link>
    </Button>
  );
}

export default NavButton;
