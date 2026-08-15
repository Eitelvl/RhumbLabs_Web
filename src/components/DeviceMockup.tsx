import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface DeviceMockupProps extends HTMLMotionProps<"div"> {
  type: 'tablet' | 'phone';
  imageSrc: string;
  alt: string;
  imageClassName?: string;
}

export function DeviceMockup({ type, imageSrc, alt, imageClassName = "w-full h-full object-cover", className, ...motionProps }: DeviceMockupProps) {
  if (type === 'tablet') {
    return (
      <motion.div
        {...motionProps}
        className={`rounded-[1.25rem] md:rounded-[1.75rem] p-[3px] md:p-[4px] bg-mockup-frame shadow-[0_20px_50px_var(--shadow-medium)] relative ${className || ''}`}
        style={{ ...motionProps.style }}
      >
        <div className="w-full h-full rounded-[1.15rem] md:rounded-[1.6rem] bg-[#000000] p-[12px] md:p-[16px] relative flex">
          <div className="w-full h-full rounded-[0.5rem] md:rounded-[0.75rem] overflow-hidden relative bg-mockup-screen">
            <img alt={alt} src={imageSrc} className={imageClassName} />
          </div>
        </div>
      </motion.div>
    );
  }

  // phone
  return (
    <motion.div
      {...motionProps}
      className={`rounded-[2rem] md:rounded-[2.5rem] p-[3px] md:p-[4px] bg-mockup-frame shadow-[0_20px_50px_var(--shadow-medium)] relative ${className || ''}`}
      style={{ ...motionProps.style }}
    >
      <div className="w-full h-full rounded-[1.85rem] md:rounded-[2.35rem] bg-[#000000] p-[8px] md:p-[12px] relative flex">
        <div className="w-full h-full rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden relative bg-mockup-screen">
          <img alt={alt} src={imageSrc} className={imageClassName} />
        </div>
      </div>
    </motion.div>
  );
}
