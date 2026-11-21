import { motion, useReducedMotion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const stillVariants = {
  hidden: { opacity: 1 },
  show: { opacity: 1 },
};

export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={reduceMotion ? stillVariants : variants}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

/* Each item reveals itself as it enters the viewport. Gating the whole group
   on a share of its height broke long grids: a tall list never has 20% of
   itself on a phone screen, so its items stayed invisible. */
export function StaggerGroup({ children, className = '' }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className = '', index = 0 }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.05, margin: '0px 0px -40px 0px' }}
      variants={reduceMotion ? stillVariants : variants}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : (index % 3) * 0.06 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
