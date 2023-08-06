import React from "react";
import { motion } from "framer-motion";
import { spinAnimation } from "@/styles/animation";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed z-50 h-full w-full bg-slate-700/80">
      <div className="flex h-full items-center justify-center">
        <motion.span
          animate={{ rotate: 360 }}
          transition={spinAnimation}
          className="h-12 w-12 rounded-full border-[6px] border-t-[6px] border-transparent border-t-primary"
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;
