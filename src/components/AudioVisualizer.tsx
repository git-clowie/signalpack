import React from 'react';
import { motion } from 'motion/react';

export function AudioVisualizer() {
  return (
    <div className="flex items-center gap-1 h-6">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-critical rounded-full"
          animate={{ height: ['4px', '24px', '4px'] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
