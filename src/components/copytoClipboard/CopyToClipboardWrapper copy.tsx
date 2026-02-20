// components/common/CopyToClipboardWrapper.tsx
import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";
import { motion, AnimatePresence  } from "framer-motion";
import type { Variants, Easing } from "framer-motion";
interface CopyToClipboardWrapperProps {
  textToCopy: string;
  children: React.ReactNode;
}

const CopyToClipboardWrapper: React.FC<CopyToClipboardWrapperProps> = ({
  textToCopy,
  children,
}) => {
  const [copied, setCopied] = useState(false);
  const [bubbleStyle, setBubbleStyle] = useState<React.CSSProperties>({});
  const [bubbles, setBubbles] = useState<
    {
      id: number;
      size: number;
      opacity: number;
      top: number;
      left: number;
      delay: number;
    }[]
  >([]);

  const triggerRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();

    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Measure trigger position safely
  useLayoutEffect(() => {
    if (triggerRef.current) {
      const { offsetHeight, offsetWidth } = triggerRef.current;

      setBubbleStyle({
        top: `-${offsetHeight / 2 + 10}px`,
        left: `${offsetWidth / 2}px`,
        transform: "translateX(-50%)",
      });
    }
  }, [copied]);

  // Generate stable bubbles per copy event
  useEffect(() => {
    if (copied) {
      setBubbles(
        Array.from({ length: 4 }).map((_, index) => ({
          id: index,
          size: Math.random() * 3 + 1,
          opacity: 0.5 + Math.random() * 0.5,
          top: Math.random() * 90,
          left: Math.random() * 90,
          delay: index * 0.1,
        }))
      );
    }
  }, [copied]);

  const copiedMessageVariants: Variants = {
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

 const bubbleVariants: Variants = {
  hidden: { opacity: 0, scale: 0, y: 0 },
  visible: {
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1.2, 1.5],
    y: [0, -5, -15, -25],
    transition: {
      duration: 1.2,
      ease: "easeOut" as Easing,
    },
  },
};

  return (
    <div
      ref={triggerRef}
      className="relative inline-block"
      onClick={handleCopy}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCopy(e);
        }
      }}
      role="button"
      tabIndex={0}
      data-testid="copy-to-clipboard-wrapper"
    >
      {children}

      <AnimatePresence>
        {copied && (
          <motion.div
            className="absolute z-50 px-2 py-2 text-green-500 text-xs rounded whitespace-nowrap pointer-events-none"
            variants={copiedMessageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={bubbleStyle}
            data-testid="copied-message-container"
          >
            <div className="relative z-10 text-xs">Copied!</div>

            <div
              className="absolute inset-0 z-0 overflow-hidden"
              data-testid="copied-bubbles-container"
            >
              {bubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  className="absolute rounded-full"
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    width: `${bubble.size}px`,
                    height: `${bubble.size}px`,
                    backgroundColor: `rgba(134, 239, 172, ${bubble.opacity})`,
                    top: `${bubble.top}%`,
                    left: `${bubble.left}%`,
                  }}
                  transition={{ delay: bubble.delay }}
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