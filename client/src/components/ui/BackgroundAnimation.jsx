import { motion } from 'framer-motion';

const BackgroundAnimation = () => {
  const circles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 300 + 100,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 z-0">
      {/* Main gradient background */}
      <div className="absolute inset-0 gradient-bg"></div>
      
      {/* Animated circles */}
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full mix-blend-overlay filter blur-xl opacity-20"
          style={{
            width: circle.size,
            height: circle.size,
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            background: `radial-gradient(circle, rgba(129, 159, 249, 0.8) 0%, rgba(217, 89, 128, 0.6) 50%, rgba(99, 172, 192, 0.4) 100%)`,
          }}
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: circle.duration,
            delay: circle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      
      {/* Floating game elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-8 h-8 bg-game-red rounded-full opacity-30"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-12 h-12 bg-game-yellow rounded-full opacity-25"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-32 left-40 w-10 h-10 bg-game-green rounded-full opacity-35"
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-6 h-6 bg-game-purple rounded-full opacity-40"
          animate={{
            y: [0, 10, 0],
            x: [0, -25, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>
      
      {/* Mesh gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-900/10 to-blue-900/20 mix-blend-overlay"></div>
    </div>
  );
};

export default BackgroundAnimation;
