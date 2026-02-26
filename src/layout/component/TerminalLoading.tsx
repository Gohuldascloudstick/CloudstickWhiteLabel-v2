import React from 'react';
import {type Variants, motion } from 'framer-motion';

// Define the fixed positions for dots along the rectangular outline.
// This creates a path roughly 10 units wide and 16 units high
// within the new 14x20px container, with approximately 2px padding on all sides.
const pathPoints = [
  // Top edge (5 dots including corners)
  { x: 2, y: 2 }, { x: 4.5, y: 2 }, { x: 7, y: 2 }, { x: 9.5, y: 2 }, { x: 12, y: 2 },
  // Right edge (5 dots, excluding top-right, including bottom-right)
  { x: 12, y: 5.2 }, { x: 12, y: 8.4 }, { x: 12, y: 11.6 }, { x: 12, y: 14.8 }, { x: 12, y: 18 },
  // Bottom edge (4 dots, excluding bottom-right, including bottom-left)
  { x: 9.5, y: 18 }, { x: 7, y: 18 }, { x: 4.5, y: 18 }, { x: 2, y: 18 },
  // Left edge (4 dots, excluding bottom-left, leading back to top-left)
  { x: 2, y: 14.8 }, { x: 2, y: 11.6 }, { x: 2, y: 8.4 }, { x: 2, y: 5.2 }
];

const dotCount = pathPoints.length; // Total number of fixed dots (now 18)

const dotVariants :Variants  = {
  // Initial state for all dots when they are inactive (dim and small)
  initial: {
    opacity: 0,
    scale: 0.4,
    transition: { // Smoothly transition to initial state
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  // Active state: the "head" of the wave (big and bright)
  active: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2, // Quick transition to active state
      ease: 'easeOut',
    },
  },
  // Trailing state: dots behind the active one (decreasing size/opacity)
  // The 'custom' prop 'i' represents the distance from the active dot.
  trailing: (i: number) => ({
    opacity: Math.max(0.2, 1 - (i * 0.25)), // Opacity decreases more for further trailing dots
    scale: Math.max(0.4, 1 - (i * 0.25)),   // Scale decreases more for further trailing dots
    transition: {
      duration: 0.4, // Smooth transition for trailing dots
      ease: 'easeOut',
    },
  }),
};

export const TerminalLoading = () => {
  const [activeDotIndex, setActiveDotIndex] = React.useState(0);

  // Effect to cycle the active dot index, creating the continuous "wave"
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActiveDotIndex(prevIndex => (prevIndex + 1) % dotCount);
    }, 80); // This interval (in ms) determines the speed of the "wave" progression

    return () => clearInterval(interval);
  }, []);

  return (
    // The main container for the animation.
    // Adjusted to a slightly larger rectangular size: width 14px, height 20px.
    <div className="relative inline-flex items-center justify-center w-3.5 h-5">
      {pathPoints.map((pos, index) => {
        let currentVariant = 'initial';
        let customTrailingDistance = 0;

        // Determine the state of each dot based on its position relative to the active dot
        if (index === activeDotIndex) {
          currentVariant = 'active'; // This is the "head"
        } else {
          // Calculate the "distance" from the active dot, wrapping around the array
          // A smaller distance means it's closer behind the active dot
          const distance = (activeDotIndex - index + dotCount) % dotCount;

          // Apply trailing variant for a few dots behind the active one
          if (distance >= 1 && distance <= 4) { // Affects the first 4 dots behind the active one
            currentVariant = 'trailing';
            customTrailingDistance = distance;
          } else {
            currentVariant = 'initial'; // Default for dots far behind or ahead
          }
        }

        return (
          <motion.span
            key={index}
            // `absolute` positioning within the container for precise placement
            // `text-[5px]` sets the dot size, slightly larger than before for better visibility.
            // `text-[#00ff00]` sets the dot color to match typical terminal text.
            className="absolute text-[12px] text-[#00aaff]"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
            }}
            variants={dotVariants}
            initial="initial"
            animate={currentVariant}
            custom={customTrailingDistance} // Pass distance to the 'trailing' variant for calculation
             data-testid={`dot-${index}`}
          >
            •
          </motion.span>
        );
      })}
    </div>
  );
};