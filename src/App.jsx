import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEgg, FaLeaf, FaSeedling, FaMountain, FaWater, FaCloud, FaCircle, FaSquare, FaStar, FaTimes, FaCheck, FaInstagram, FaGlobe, FaEnvelope } from 'react-icons/fa';

// Color themes
const colorThemes = [
  { primary: '#4CAF50', secondary: '#4CAF50' }, // Same darker green for both
  { primary: '#FFB5E8', secondary: '#B5DEFF' }, // Pink & Blue
  { primary: '#B5FFE1', secondary: '#FFB5B5' }, // Mint & Coral
  { primary: '#FFB5D8', secondary: '#D8B5FF' }, // Pink & Purple
  { primary: '#D8B5FF', secondary: '#B5FFE1' }, // Purple & Mint
  { primary: '#FFD8B5', secondary: '#B5DEFF' }, // Peach & Blue
];

const discounts = [
  { code: 'POTTERY5', value: '$5 off pottery wheel class', rarity: 'common', size: 'medium' },
  { code: 'MUG10', value: '$10 off the perfect mug', rarity: 'common', size: 'medium' },
  { code: 'GLAZE60', value: '60% off glazing', rarity: 'rare', size: 'small' },
  { code: 'WHEEL10', value: '$10 off pottery wheel class', rarity: 'common', size: 'medium' },
  { code: 'CLASS25', value: '25% off any class', rarity: 'uncommon', size: 'small' },
  { code: 'CLASS10', value: '10% off any class', rarity: 'common', size: 'medium' },
  { code: 'FREEGLAZE', value: 'Free Glazing', rarity: 'legendary', size: 'tiny' },
];

const spoiledEggs = Array(30).fill(null).map(() => ({
  type: 'spoiled',
  message: 'Just clay! Try again!',
  size: Math.random() > 0.5 ? 'medium' : 'small'
}));

const App = () => {
  const [showDevMode] = useState(false);
  const [foundDiscounts, setFoundDiscounts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [elements, setElements] = useState([]);
  const [codeCopied, setCodeCopied] = useState(false);
  const [currentTheme, setCurrentTheme] = useState({
    primary: colorThemes[0].primary,
    secondary: colorThemes[0].secondary
  });
  const containerRef = useRef(null);

  // Handle scroll and theme changes
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sectionHeight = window.innerHeight * 30;
      const initialBuffer = window.innerHeight * 6; // Buffer before first color change
      
      // Don't start changing colors until after the initial buffer
      if (scrollPosition < initialBuffer) {
        return;
      }

      const adjustedScroll = scrollPosition - initialBuffer;
      const scrollProgress = (adjustedScroll % sectionHeight) / sectionHeight;
      const themeIndex = Math.floor(adjustedScroll / sectionHeight) % colorThemes.length;
      const nextThemeIndex = (themeIndex + 1) % colorThemes.length;
      
      // Interpolate between current and next theme
      const interpolateColor = (color1, color2, progress) => {
        const r1 = parseInt(color1.slice(1, 3), 16);
        const g1 = parseInt(color1.slice(3, 5), 16);
        const b1 = parseInt(color1.slice(5, 7), 16);
        const r2 = parseInt(color2.slice(1, 3), 16);
        const g2 = parseInt(color2.slice(3, 5), 16);
        const b2 = parseInt(color2.slice(5, 7), 16);
        
        const r = Math.round(r1 + (r2 - r1) * progress);
        const g = Math.round(g1 + (g2 - g1) * progress);
        const b = Math.round(b1 + (b2 - b1) * progress);
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      setCurrentTheme({
        primary: interpolateColor(
          colorThemes[themeIndex].primary,
          colorThemes[nextThemeIndex].primary,
          scrollProgress
        ),
        secondary: interpolateColor(
          colorThemes[themeIndex].secondary,
          colorThemes[nextThemeIndex].secondary,
          scrollProgress
        )
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const pageHeight = 100000;
    const elements = [];
    
    // Add even more decorative elements with enhanced variety and animations
    for (let i = 0; i < 3000; i++) {
      const type = Math.random() > 0.7 ? 'leaf' : 
                  Math.random() > 0.6 ? 'plant' : 
                  Math.random() > 0.5 ? 'mountain' : 
                  Math.random() > 0.4 ? 'water' : 
                  Math.random() > 0.3 ? 'cloud' :
                  Math.random() > 0.2 ? 'circle' : 'star';
      
      const size = Math.random() * 60 + 5; // More varied sizes (5-65px)
      const opacity = 0.8 + Math.random() * 0.2; // Much higher opacity
      const rotation = Math.random() * 360;
      const scale = 0.2 + Math.random() * 2.5; // More varied scale
      const animationDuration = 3 + Math.random() * 7; // Random duration between 3-10s
      const animationDelay = Math.random() * -5; // Random start time
      
      elements.push({
        id: `decor-${i}`,
        type,
        isEgg: false,
        position: {
          top: Math.random() * pageHeight,
          left: Math.random() * window.innerWidth,
          rotation,
          scale,
          opacity,
          size,
          animationDuration,
          animationDelay,
          moveRange: 20 + Math.random() * 40, // Random movement range
          rotateRange: 10 + Math.random() * 20 // Random rotation range
        }
      });
    }

    // Add eggs with completely random positioning
    [...discounts, ...spoiledEggs].forEach((item, index) => {
      // Completely random positioning without sections
      const top = Math.random() * pageHeight;
      const left = Math.random() * (window.innerWidth - 100) + 50;
      const rotation = Math.random() * 360;
      const opacity = 1; // Full opacity for eggs
      const size = Math.random() * 60 + 5;
      const scale = 0.2 + Math.random() * 2.5;
      const animationDuration = 3 + Math.random() * 7;
      const animationDelay = Math.random() * -5;
      const moveRange = 20 + Math.random() * 40;
      const rotateRange = 10 + Math.random() * 20;
      
      // Ensure minimum distance between eggs
      let validPosition = false;
      let attempts = 0;
      let finalTop = top;
      let finalLeft = left;
      
      while (!validPosition && attempts < 10) {
        validPosition = true;
        for (const existingElement of elements) {
          if (existingElement.isEgg) {
            const distance = Math.sqrt(
              Math.pow(finalTop - existingElement.position.top, 2) +
              Math.pow(finalLeft - existingElement.position.left, 2)
            );
            if (distance < 200) { // Minimum 200px between eggs
              validPosition = false;
              finalTop = Math.random() * pageHeight;
              finalLeft = Math.random() * (window.innerWidth - 100) + 50;
              attempts++;
              break;
            }
          }
        }
      }
      
      elements.push({
        id: item.code || `spoiled-${index}`,
        type: 'egg',
        isEgg: true,
        item,
        position: {
          top: finalTop,
          left: finalLeft,
          rotation,
          scale,
          opacity,
          size,
          animationDuration,
          animationDelay,
          moveRange,
          rotateRange
        }
      });
    });

    // Shuffle all elements for more randomness
    const shuffledElements = elements.sort(() => Math.random() - 0.5);
    setElements(shuffledElements);
  }, []);

  const handleEggClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentItem(item);
    setShowModal(true);
    
    if (item.code && !foundDiscounts.includes(item.code)) {
      setFoundDiscounts([...foundDiscounts, item.code]);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000); // Reset after 2 seconds
  };

  const renderElement = (element, theme) => {
    if (element.isEgg) {
      const isSpoiled = element.item.type === 'spoiled';
      
      return (
        <motion.div
          key={element.id}
          className={`egg absolute ${showDevMode ? 'ring-2 ring-red-500' : ''}`}
          style={{
            position: 'absolute',
            top: `${element.position.top}px`,
            left: `${element.position.left}px`,
            width: `${element.position.size}px`,
            height: `${element.position.size}px`,
            transform: `rotate(${element.position.rotation}deg) scale(${element.position.scale})`,
            opacity: element.position.opacity,
            zIndex: 2,
            cursor: 'pointer',
            mixBlendMode: 'normal',
            color: theme.primary,
            filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
            WebkitFilter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
          }}
          onClick={(e) => handleEggClick(e, element.item)}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            y: [0, -element.position.moveRange, 0],
            x: [-element.position.moveRange/2, element.position.moveRange/2, -element.position.moveRange/2],
            rotate: [
              element.position.rotation,
              element.position.rotation + element.position.rotateRange,
              element.position.rotation - element.position.rotateRange,
              element.position.rotation
            ],
            scale: [
              element.position.scale,
              element.position.scale * 1.2,
              element.position.scale * 0.9,
              element.position.scale
            ],
          }}
          transition={{
            duration: element.position.animationDuration,
            delay: element.position.animationDelay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FaEgg className="w-full h-full" />
        </motion.div>
      );
    }

    const Icon = {
      leaf: FaLeaf,
      plant: FaSeedling,
      mountain: FaMountain,
      water: FaWater,
      cloud: FaCloud,
      circle: FaCircle,
      star: FaStar
    }[element.type];

    return (
      <motion.div
        key={element.id}
        className="absolute"
        style={{
          position: 'absolute',
          top: `${element.position.top}px`,
          left: `${element.position.left}px`,
          transform: `rotate(${element.position.rotation}deg) scale(${element.position.scale})`,
          opacity: element.position.opacity,
          zIndex: 1,
          width: `${element.position.size}px`,
          height: `${element.position.size}px`,
          mixBlendMode: 'normal',
          color: theme.primary,
          filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))',
          WebkitFilter: 'drop-shadow(0 0 2px rgba(0,0,0,0.3))'
        }}
        animate={{
          y: [0, -element.position.moveRange, 0],
          x: [-element.position.moveRange/2, element.position.moveRange/2, -element.position.moveRange/2],
          rotate: [
            element.position.rotation,
            element.position.rotation + element.position.rotateRange,
            element.position.rotation - element.position.rotateRange,
            element.position.rotation
          ],
          scale: [
            element.position.scale,
            element.position.scale * 1.2,
            element.position.scale * 0.9,
            element.position.scale
          ],
        }}
        transition={{
          duration: element.position.animationDuration,
          delay: element.position.animationDelay,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon className="w-full h-full" />
      </motion.div>
    );
  };

  return (
    <div 
      className="min-h-screen relative transition-colors duration-1000"
      style={{
        background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      }}
    >
      {/* Header */}
      <header className="fixed top-0 w-full bg-white bg-opacity-90 z-10 p-4 shadow-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">
              Pottery Chicago Easter Hunt
            </h1>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/potterychicago" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a 
                href="https://thepotteryloop.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaGlobe className="w-6 h-6" />
              </a>
              <a 
                href="mailto:potterchicago@gmail.com?subject=Easter Egg Pottery Question" 
                className="text-gray-700 hover:text-gray-900 transition-colors"
              >
                <FaEnvelope className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <section className="container mx-auto px-4 py-8">
          <h2 className="text-4xl font-bold text-center mb-8 text-black">
            Find Hidden Easter Eggs!
          </h2>
          <p className="text-center text-lg mb-12 text-black">
            Click on the hidden eggs to discover special discounts for pottery classes!
            Valid for 48 hours only.
          </p>
        </section>

        {/* All Elements */}
        <div ref={containerRef} className="relative min-h-[100000px] w-full overflow-hidden">
          {elements.map(element => renderElement(element, currentTheme))}
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-[1000]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <motion.div
              className="relative bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 z-[1001]"
              initial={{ scale: 0.5, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: -50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold mb-4 text-black">
                {currentItem?.type === 'spoiled' ? 'Oops!' : 'Congratulations! 🎉'}
              </h3>
              {currentItem?.type === 'spoiled' ? (
                <>
                  <p className="text-lg mb-4 text-black">Just clay! Try again!</p>
                  <p className="text-sm text-gray-700">Keep searching for more eggs!</p>
                </>
              ) : (
                <>
                  <p className="text-lg mb-4 text-black">You found a special discount!</p>
                  <p className="text-xl font-bold mb-4 text-black">{currentItem?.value}</p>
                  <p className="text-lg mb-4 text-black">Use code: <span className="font-bold">{currentItem?.code}</span></p>
                  <p className="text-sm text-gray-700 mb-6">Valid for 48 hours only!</p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleCopyCode(currentItem?.code)}
                      className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        codeCopied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-terracotta text-white hover:bg-terracotta-dark'
                      }`}
                    >
                      {codeCopied ? (
                        <>
                          <FaCheck className="w-5 h-5" />
                          Code Copied
                        </>
                      ) : (
                        'Copy Code'
                      )}
                    </button>
                    <a
                      href="https://ThePotteryLoop.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors text-center"
                    >
                      Book Class
                    </a>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App; 