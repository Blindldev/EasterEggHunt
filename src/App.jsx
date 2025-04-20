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
  { code: 'HAND10', value: '$10 off $25 Handbuilding class', rarity: 'common', size: 'medium' },
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
    
    // Further reduce decorative elements and optimize animations for mobile
    for (let i = 0; i < 1500; i++) { // Reduced from 2500 to 1500
      const type = Math.random() > 0.7 ? 'leaf' : 
                  Math.random() > 0.6 ? 'plant' : 
                  Math.random() > 0.5 ? 'mountain' : 
                  Math.random() > 0.4 ? 'water' : 
                  Math.random() > 0.3 ? 'cloud' :
                  Math.random() > 0.2 ? 'circle' : 'star';
      
      const size = Math.random() * 30 + 5; // Further reduced max size (5-35px)
      const opacity = 0.8 + Math.random() * 0.2;
      const rotation = Math.random() * 360;
      const scale = 0.2 + Math.random() * 1.2; // Further reduced scale range
      const animationDuration = 8 + Math.random() * 4; // Even slower animations (8-12s)
      const animationDelay = Math.random() * -5;
      const moveRange = 5 + Math.random() * 15; // Further reduced movement range
      const rotateRange = 3 + Math.random() * 6; // Further reduced rotation range
      
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
          moveRange,
          rotateRange
        }
      });
    }

    // Add guaranteed egg near the top
    const guaranteedEgg = {
      code: 'POTTERY5',
      value: '$5 off pottery wheel class',
      rarity: 'common',
      size: 'medium'
    };

    // Add guaranteed egg first
    const topSectionHeight = pageHeight * 0.1; // Top 10% of the page
    const topSectionWidth = window.innerWidth;
    
    const guaranteedTop = Math.random() * topSectionHeight;
    const guaranteedLeft = Math.random() * (topSectionWidth - 100) + 50;
    
    elements.push({
      id: 'guaranteed-egg',
      type: 'egg',
      isEgg: true,
      item: guaranteedEgg,
      position: {
        top: guaranteedTop,
        left: guaranteedLeft,
        rotation: Math.random() * 360,
        scale: 0.8 + Math.random() * 0.4,
        opacity: 1,
        size: 20 + Math.random() * 10, // Medium size (20-30px)
        animationDuration: 8 + Math.random() * 4,
        animationDelay: Math.random() * -5,
        moveRange: 5 + Math.random() * 15,
        rotateRange: 3 + Math.random() * 6
      }
    });

    // Increase number of discount eggs by 50%
    const totalDiscountEggs = Math.floor(discounts.length * 1.5);
    const extraDiscountEggs = Array(totalDiscountEggs - discounts.length).fill(null).map(() => {
      const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
      return {
        ...randomDiscount,
        code: `${randomDiscount.code}-${Math.random().toString(36).substr(2, 4)}`
      };
    });

    // Keep spoiled eggs the same
    const totalEggs = totalDiscountEggs + spoiledEggs.length;
    const extraSpoiledEggs = Array(spoiledEggs.length).fill(null).map(() => ({
      type: 'spoiled',
      message: 'Just clay! Try again!',
      size: Math.random() > 0.5 ? 'medium' : 'small'
    }));

    // Add remaining eggs with optimized positioning
    [...discounts.filter(d => d.code !== 'POTTERY5'), ...extraDiscountEggs, ...spoiledEggs, ...extraSpoiledEggs].forEach((item, index) => {
      // Calculate position based on index to ensure even distribution
      const sectionWidth = window.innerWidth / 4; // Divide page into 4 vertical sections
      const sectionHeight = pageHeight / 4; // Divide page into 4 horizontal sections
      
      const sectionIndex = index % 16; // 16 sections total (4x4 grid)
      const row = Math.floor(sectionIndex / 4);
      const col = sectionIndex % 4;
      
      // Add some randomness within each section
      const top = (row * sectionHeight) + (Math.random() * sectionHeight * 0.8);
      const left = (col * sectionWidth) + (Math.random() * sectionWidth * 0.8);
      
      const rotation = Math.random() * 360;
      const opacity = 1; // Full opacity for eggs
      // Adjust size distribution to favor smaller eggs
      const size = Math.random() > 0.7 ? 
        Math.random() * 20 + 5 : // 30% chance of tiny eggs (5-25px)
        Math.random() > 0.5 ? 
          Math.random() * 15 + 10 : // 35% chance of small eggs (10-25px)
          Math.random() * 10 + 20; // 35% chance of medium eggs (20-30px)
      const scale = 0.2 + Math.random() * 1.2;
      const animationDuration = 8 + Math.random() * 4;
      const animationDelay = Math.random() * -5;
      const moveRange = 5 + Math.random() * 15;
      const rotateRange = 3 + Math.random() * 6;
      
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
            if (distance < 150) { // Reduced minimum distance between eggs
              validPosition = false;
              // Try a new random position within the same section
              finalTop = (row * sectionHeight) + (Math.random() * sectionHeight * 0.8);
              finalLeft = (col * sectionWidth) + (Math.random() * sectionWidth * 0.8);
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
      <header className="fixed top-0 w-full bg-white bg-opacity-90 z-10 p-2 sm:p-4 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6">
            <div className="flex gap-4 sm:gap-6 order-2 sm:order-1">
              <a 
                href="https://www.instagram.com/potterychicago" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-pink-500 transition-colors duration-300"
                title="Follow us on Instagram"
              >
                <FaInstagram className="w-5 h-5 sm:w-7 sm:h-7" />
              </a>
              <a 
                href="https://thepotteryloop.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-500 transition-colors duration-300"
                title="Visit our website"
              >
                <FaGlobe className="w-5 h-5 sm:w-7 sm:h-7" />
              </a>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-black text-center order-1 sm:order-2 w-full sm:w-auto">
              @PotteryChicago Easter Egg Hunt
            </h1>
            <div className="flex gap-4 sm:gap-6 order-3">
              <a 
                href="mailto:potterchicago@gmail.com?subject=Easter Egg Pottery Question" 
                className="text-gray-700 hover:text-red-500 transition-colors duration-300"
                title="Contact us"
              >
                <FaEnvelope className="w-5 h-5 sm:w-7 sm:h-7" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 sm:pt-20">
        <section className="container mx-auto px-4 py-4 sm:py-8">
          <h2 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-8 text-black">
            Find Hidden Easter Eggs!
          </h2>
          <p className="text-base sm:text-lg text-center mb-8 sm:mb-12 text-black px-2">
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
            className="fixed inset-0 flex items-center justify-center z-[1000] p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <motion.div
              className="relative bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 z-[1001]"
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
                <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black">
                {currentItem?.type === 'spoiled' ? 'Oops!' : 'Congratulations! 🎉'}
              </h3>
              {currentItem?.type === 'spoiled' ? (
                <>
                  <p className="text-base sm:text-lg mb-3 sm:mb-4 text-black">Just clay! Try again!</p>
                  <p className="text-xs sm:text-sm text-gray-700">Keep searching for more eggs!</p>
                </>
              ) : (
                <>
                  <p className="text-base sm:text-lg mb-3 sm:mb-4 text-black">You found a special discount!</p>
                  <p className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-black">{currentItem?.value}</p>
                  <p className="text-base sm:text-lg mb-3 sm:mb-4 text-black">Use code: <span className="font-bold">{currentItem?.code}</span></p>
                  <p className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-6">Valid for 48 hours only!</p>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <button
                      onClick={() => handleCopyCode(currentItem?.code)}
                      className={`w-full px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                        codeCopied 
                          ? 'bg-green-500 text-white' 
                          : 'bg-terracotta text-white hover:bg-terracotta-dark'
                      }`}
                    >
                      {codeCopied ? (
                        <>
                          <FaCheck className="w-4 h-4 sm:w-5 sm:h-5" />
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
                      className="w-full px-3 sm:px-4 py-2 bg-sage text-white rounded-lg hover:bg-sage-dark transition-colors text-center text-sm sm:text-base"
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