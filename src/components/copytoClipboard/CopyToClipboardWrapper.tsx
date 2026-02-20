// components/common/CopyToClipboardWrapper.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface CopyToClipboardWrapperProps {
  textToCopy: string;
  children: React.ReactElement; // Accepts any React element as a child
}

const CopyToClipboardWrapper: React.FC<CopyToClipboardWrapperProps> = ({ textToCopy, children }) => {
  const [copied, setCopied] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null); // Ref to position the bubble animation

  const handleCopy = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent potential parent click handlers from firing
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Match bubble animation duration
    }
  };

  // Framer Motion Variants for the "Copied!" text container
  const copiedMessageVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
      },
    },
    exit: {
      opacity: 0,
      y: 5,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Framer Motion Variants for individual bubbles
  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0, y: 0 },
    visible: {
      opacity: [0, 1, 1, 0],
      scale: [0, 1, 1.2, 1.5],
      y: [0, -5, -15, -25],
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  // Clone the child element to add the onClick handler, ref, and data-testid
  const childWithProps = React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      handleCopy(e);
      if (typeof children.props.onClick === 'function') {
        children.props.onClick(e); // Preserve original onClick if it exists
      }
    },
    ref: triggerRef, // Attach ref to the child for positioning
    style: { ...children.props.style, position: 'relative' }, // Ensure child is relative for positioning
    'data-testid': 'copy-trigger', // Add data-testid to the cloned child
  });

  // Determine position of the bubble relative to the clicked element
  const bubblePositionStyle: React.CSSProperties = {};
  if (triggerRef.current) {
    const {  offsetHeight } = triggerRef.current;
    // Position it roughly above the center of the trigger element
    bubblePositionStyle.top = `-${offsetHeight / 2 + 10}px`; // Adjust 10px for spacing
    bubblePositionStyle.left = `-2px`;
    bubblePositionStyle.transform = `translateX(-50%)`;
  }

  return (
    <div className="relative inline-block" data-testid="copy-to-clipboard-wrapper">
      {childWithProps}
      <AnimatePresence>
        {copied && (
          <motion.div
            className="absolute z-50 px-2 py-2 text-green-500 text-xs rounded whitespace-nowrap pointer-events-none"
            variants={copiedMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={bubblePositionStyle} // Apply dynamic position
            data-testid="copied-message-container"
          >
            <div className="relative z-10 text-xs">Copied!</div>
            <div className="absolute l inset-0 z-0 overflow-hidden" data-testid="copied-bubbles-container">
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full"
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    backgroundColor: `rgba(134, 239, 172, ${0.5 + Math.random() * 0.5})`,
                    top: `${Math.random() * 90}%`,
                    left: `${Math.random() * 90}%`,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CopyToClipboardWrapper;