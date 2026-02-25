// components/common/CopyToClipboardWrapper.tsx
import React, { useState } from "react";
import { motion, AnimatePresence,type Variants } from "framer-motion";

type ChildProps = React.HTMLAttributes<HTMLElement> & {
  "data-testid"?: string;
};

interface CopyToClipboardWrapperProps {
  textToCopy: string;
  children: React.ReactElement<ChildProps>;
}

const CopyToClipboardWrapper: React.FC<CopyToClipboardWrapperProps> = ({
  textToCopy,
  children,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }

    if (children.props.onClick) {
      children.props.onClick(event);
    }
  };

  const copiedMessageVariants: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut",
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

  const bubbleVariants: Variants = {
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

  const childWithProps = React.cloneElement(children, {
    onClick: handleCopy,
    style: {
      ...(children.props.style ?? {}),
      position: "relative",
      cursor: "pointer",
    },
    "data-testid": "copy-trigger",
  });

  return (
    <div
      className="relative inline-block"
      data-testid="copy-to-clipboard-wrapper"
    >
      {childWithProps}

      <AnimatePresence>
        {copied && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 -top-8 z-50 px-2 py-1 text-green-500 text-xs rounded whitespace-nowrap pointer-events-none"
            variants={copiedMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            data-testid="copied-message-container"
          >
            <div className="relative z-10 text-xs">Copied!</div>

            <div
              className="absolute inset-0 z-0 overflow-hidden"
              data-testid="copied-bubbles-container"
            >
              {[...Array(4)].map((_, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full"
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  style={{
                    width: `${Math.random() * 3 + 2}px`,
                    height: `${Math.random() * 3 + 2}px`,
                    backgroundColor: `rgba(134, 239, 172, ${
                      0.5 + Math.random() * 0.5
                    })`,
                    top: `${Math.random() * 80}%`,
                    left: `${Math.random() * 80}%`,
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