"use client";

import {motion, useAnimation, type Transition } from "framer-motion";



interface CopyProps extends React.SVGAttributes<SVGSVGElement> {
  width?: number;
  height?: number;
  strokeWidth?: number;
  stroke?: string;
}

const defaultTransition: Transition = {
  type: "spring",
  stiffness: 160,
  damping: 17,
  mass: 1,
};

const Copy = ({
  width = 18,
  height = 18,
  strokeWidth = 2,
  stroke = "#ffffff",
  ...props
}: CopyProps) => {
  const controls = useAnimation();

  return (
    <div
   className="text-default-400 dark:text-default-700 cursor-pointer"
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
        data-testid="copy-icon" // Added unique identifier here
    
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <motion.rect
          width="14"
          height="14"
          x="8"
          y="8"
          rx="2"
          ry="2"
          variants={{
            normal: { translateY: 0, translateX: 0 },
            animate: { translateY: -3, translateX: -3 },
          }}
          animate={controls}
          transition={defaultTransition}
        />
        <motion.path
          d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
          variants={{
            normal: { x: 0, y: 0 },
            animate: { x: 3, y: 3 },
          }}
          transition={defaultTransition}
          animate={controls}
        />
      </svg>
    </div>
  );
};

export { Copy };
