"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";


const navItems = [
  { label: "Home", href: "/" },
  { label: "Companions", href: "/companions" },
  { label: "My Journey", href: "/my-journey" },
];
const Navitems = () => {
    const Pathname = usePathname();
  return (
    <div className="flex items-center gap-4">
        {navItems.map(({label, href}) => (
            <Link href={href} key={label} className={cn((Pathname === href ? "text-black" : "text-gray-500"), "hover:text-black transition-colors duration-300")}>
                {label}
            </Link>
        ))}
    </div>
  )
}

export default Navitems