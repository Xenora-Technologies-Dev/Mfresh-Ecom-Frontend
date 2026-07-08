"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Expression = "happy" | "thinking" | "talking" | "wave";

export function MFreshyCharacter({
  size = 48,
  expression = "happy",
  className,
}: {
  size?: number;
  expression?: Expression;
  className?: string;
}) {
  const eyeScaleY = expression === "happy" ? 1 : expression === "thinking" ? 0.6 : 1;
  const mouthPath =
    expression === "talking"
      ? "M 18 34 Q 24 38 30 34"
      : expression === "thinking"
        ? "M 20 35 Q 24 33 28 35"
        : expression === "wave"
          ? "M 17 33 Q 24 40 31 33"
          : "M 18 34 Q 24 38 30 34";

  return (
    <motion.div
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
      animate={
        expression === "wave"
          ? { rotate: [0, -8, 8, -6, 6, 0] }
          : { y: [0, -2, 0] }
      }
      transition={
        expression === "wave"
          ? { duration: 0.7, repeat: Infinity, repeatDelay: 2 }
          : { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full drop-shadow-sm">
        {/* Leaf */}
        <motion.path
          d="M24 6 C20 6 18 10 19 14 C22 12 25 10 27 8 C26 6 25 6 24 6Z"
          fill="#52B788"
          animate={{ rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ transformOrigin: "24px 10px" }}
        />
        {/* Apple body */}
        <ellipse cx="24" cy="26" rx="17" ry="16" fill="#ED1C24" />
        <ellipse cx="24" cy="26" rx="17" ry="16" fill="url(#appleShine)" />
        {/* Highlight */}
        <ellipse cx="17" cy="20" rx="5" ry="7" fill="white" opacity="0.18" />
        {/* Cheeks */}
        <circle cx="14" cy="30" r="3.5" fill="#FF6B7A" opacity="0.35" />
        <circle cx="34" cy="30" r="3.5" fill="#FF6B7A" opacity="0.35" />
        {/* Eyes */}
        <motion.g
          animate={{ scaleY: [eyeScaleY, eyeScaleY === 1 ? 0.1 : eyeScaleY, eyeScaleY] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 }}
          style={{ transformOrigin: "19px 26px" }}
        >
          <ellipse cx="19" cy="26" rx="2.8" ry="3.2" fill="#1A1D4E" />
          <circle cx="20" cy="25" r="1" fill="white" />
        </motion.g>
        <motion.g
          animate={{ scaleY: [eyeScaleY, eyeScaleY === 1 ? 0.1 : eyeScaleY, eyeScaleY] }}
          transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 3.5 }}
          style={{ transformOrigin: "29px 26px" }}
        >
          <ellipse cx="29" cy="26" rx="2.8" ry="3.2" fill="#1A1D4E" />
          <circle cx="30" cy="25" r="1" fill="white" />
        </motion.g>
        {/* Mouth */}
        <motion.path
          d={mouthPath}
          stroke="#1A1D4E"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          animate={
            expression === "talking"
              ? { d: ["M 18 34 Q 24 38 30 34", "M 18 34 Q 24 36 30 34", "M 18 34 Q 24 40 30 34"] }
              : {}
          }
          transition={expression === "talking" ? { duration: 0.3, repeat: Infinity } : {}}
        />
        <defs>
          <radialGradient id="appleShine" cx="0.35" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#FF4D56" />
            <stop offset="100%" stopColor="#C4161D" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
