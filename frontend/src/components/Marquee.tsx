import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect, useState, ReactNode } from "react";

export default function Marquee({
  children,
  speed = 18,
}: {
  children: ReactNode;
  speed?: number;
}) {
  const controls = useAnimation();
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(0);
  const timeoutRef = useRef<any>(null);

  // Handle auto animation
  const startAnimation = () => {
    controls.start({
      x: [0, -width],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
      },
    });
  };

  const stopAnimation = () => controls.stop();

  useEffect(() => {
    if (trackRef.current) {
      setWidth(trackRef.current.scrollWidth / 2);
    }
    startAnimation();
  }, [children, width, speed]);

  // Pause on user scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      stopAnimation();

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        startAnimation();
      }, 1500);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className="overflow-x-auto w-full scrollbar-hide cursor-grab active:cursor-grabbing"
    >
      <motion.div
        ref={trackRef}
        className="flex whitespace-nowrap"
        animate={controls}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
