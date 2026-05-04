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
        className={`rounded-[1.25rem] md:rounded-[1.75rem] p-[3px] md:p-[4px] bg-[#3B424D] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative ${className || ''}`}
        style={{ ...motionProps.style }}
      >
        <div className="w-full h-full rounded-[1.15rem] md:rounded-[1.6rem] bg-[#000000] p-[12px] md:p-[16px] relative flex">
          <div className="absolute top-[6px] md:top-[8px] left-1/2 -translate-x-1/2 flex justify-center items-center z-20">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#1a1f26] shadow-[inset_0_0_2px_rgba(0,0,0,1)] rounded-full"></div>
          </div>
          <div className="w-full h-full rounded-[0.5rem] md:rounded-[0.75rem] overflow-hidden relative bg-[#0a0f16]">
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
      className={`rounded-[2rem] md:rounded-[2.5rem] p-[3px] md:p-[4px] bg-[#3B424D] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative ${className || ''}`}
      style={{ ...motionProps.style }}
    >
      <div className="w-full h-full rounded-[1.85rem] md:rounded-[2.35rem] bg-[#000000] p-[8px] md:p-[12px] relative flex">
        <div className="w-full h-full rounded-[1.4rem] md:rounded-[1.8rem] overflow-hidden relative bg-[#0a0f16]">
          <div className="absolute top-[8px] md:top-[12px] left-1/2 -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-[#0a0b0d] shadow-[inset_0_0_4px_rgba(0,0,0,1)] rounded-full z-20"></div>
          <img alt={alt} src={imageSrc} className={imageClassName} />
        </div>
      </div>
    </motion.div>
  );
}
