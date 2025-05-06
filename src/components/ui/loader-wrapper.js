'use client';
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import SlideLoader from "@/components/ui/loader-page";

export default function LoaderWrapper({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timeout);
    }, [pathname]);

    return isLoading ? <SlideLoader /> : children;
}
