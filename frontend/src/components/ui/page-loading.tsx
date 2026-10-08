import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner"; 

interface PageLoadingProps {
  isLoading: boolean;
}

const SESSION_KEY = "has_seen_splash";
const FADE_DURATION = 400; 

export function PageLoading({ isLoading }: PageLoadingProps) {
  const [isFirstVisit] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem(SESSION_KEY);
    }
    return true;
  });

  const [progress, setProgress] = useState(0);
  const [isDoneAnimating, setIsDoneAnimating] = useState(!isFirstVisit);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isFirstVisit || !isLoading) return;

    const tick = () => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        return Math.min(prev + remaining * 0.02 + 0.15, 90);
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isLoading, isFirstVisit]);

  useEffect(() => {
    if (!isFirstVisit) return;

    if (!isLoading) {
      setProgress(100);
      sessionStorage.setItem(SESSION_KEY, "true");

      const fadeStartTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 500);

      const unmountTimer = setTimeout(() => {
        setIsDoneAnimating(true);
      }, 500 + FADE_DURATION);

      return () => {
        clearTimeout(fadeStartTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [isLoading, isFirstVisit]);

  if (!isFirstVisit || isDoneAnimating) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-primary select-none transition-opacity ease-in-out"
      style={{
        transitionDuration: `${FADE_DURATION}ms`,
        opacity: isFadingOut ? 0 : 1,
      }}
    >
      {/* <div className="flex flex-row items-center gap-0"> 
        <img src={Logo} alt="CCS Logo" className="h-12 w-12 rounded-full object-cover" />
        <p className="text-2xl font-bold text-white">DEPARTMENT OF COMPUTER APPLICATIONS</p>
      </div> */}

      <Spinner className="h-14 w-14 text-white" />

      <div className="fixed bottom-0 left-0 h-2 w-full bg-white/10">
        <div
          className="h-full bg-white transition-[width] duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}