import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEgg, FaLeaf, FaSeedling, FaMountain, FaWater, FaCloud, FaCircle, FaSquare, FaStar, FaTimes, FaCheck, FaInstagram, FaGlobe, FaEnvelope } from 'react-icons/fa';
import '../src/index.css';

console.log('App component initializing...');

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
  { code: '25Pottery420', value: '$25 Handbuiling, Wheel Class or Mug!', rarity: 'common', size: 'small', link: 'https://www.thepotteryloop.com/' },
  { code: 'Wheel42050', value: '$5 off pottery wheel class', rarity: 'common', size: 'small', link: 'https://www.thepotteryloop.com/booking-calendar/potterywheel?referral=service_list_widget' },
  { code: 'Wheel918213', value: '20% off Pottery Wheel class', rarity: 'uncommon', size: 'medium', link: 'https://www.thepotteryloop.com/booking-calendar/potterywheel?referral=service_list_widget' },
  { code: 'Wheel778120', value: '$10 off pottery wheel class', rarity: 'rare', size: 'large', link: 'https://www.thepotteryloop.com/booking-calendar/potterywheel?referral=service_list_widget' },
  { code: 'Glaze918212', value: '20% off Glazing class (class 2)', rarity: 'common', size: 'medium', link: 'https://www.thepotteryloop.com/booking-calendar/glazing-classes?referral=service_list_widget' },
  { code: 'Glaze921389', value: '40% off Glazing class (class 2)', rarity: 'uncommon', size: 'large', link: 'https://www.thepotteryloop.com/booking-calendar/glazing-classes?referral=service_list_widget' },
  { code: 'Mugs42050', value: '$25 Perfect Mug class ($10 off)', rarity: 'common', size: 'large', link: 'https://www.thepotteryloop.com/booking-calendar/the-perfect-mug?referral=service_list_widget' },
  { code: 'Hand200407', value: '20% off Hand Building class', rarity: 'rare', size: 'large', link: 'https://www.thepotteryloop.com/booking-calendar/pottery-hand-building-workshop?referral=service_list_widget' }
];

const spoiledEggs = Array(30).fill(null).map(() => ({
  type: 'spoiled',
  message: 'Just clay! Try again!',
  size: Math.random() > 0.5 ? 'medium' : 'small'
}));

const App = () => {
  console.log('App function component rendering...');

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

  useEffect(() => {
    console.log('App component mounted');
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
    return () => {
      console.log('App component unmounting');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const pageHeight = 100000;
    const elements = [];
    
    // Increase decorative elements to 5000 (reduced from 15000)
    for (let i = 0; i < 5000; i++) {
      const type = Math.random() > 0.7 ? 'leaf' : 
                  Math.random() > 0.6 ? 'plant' : 
                  Math.random() > 0.5 ? 'mountain' : 
                  Math.random() > 0.4 ? 'water' : 
                  Math.random() > 0.3 ? 'cloud' :
                  Math.random() > 0.2 ? 'circle' : 'star';
      
      // Increase the base size and make more elements larger
      const size = Math.random() > 0.3 ? Math.random() * 40 + 20 : Math.random() * 20 + 5; // 20-60px for 70% of elements, 5-25px for 30%
      const opacity = 0.8 + Math.random() * 0.2;
      const rotation = Math.random() * 360;
      const scale = 0.2 + Math.random() * 1.2;
      
      // Only 20% of elements will be animated
      const isAnimated = Math.random() < 0.2;
      const animationDuration = isAnimated ? 8 + Math.random() * 4 : 0; // 8-12s or no animation
      const animationDelay = isAnimated ? Math.random() * -5 : 0;
      const moveRange = isAnimated ? 5 + Math.random() * 15 : 0;
      const rotateRange = isAnimated ? 3 + Math.random() * 6 : 0;
      
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
          rotateRange,
          isAnimated
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

    const topSectionHeight = pageHeight * 0.1;
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
        size: 20 + Math.random() * 10,
        animationDuration: 8 + Math.random() * 4,
        animationDelay: Math.random() * -5,
        moveRange: 5 + Math.random() * 15,
        rotateRange: 3 + Math.random() * 6,
        isAnimated: true // Guaranteed egg is always animated
      }
    });

    // Increase number of discount eggs to 45 (3x more)
    const totalDiscountEggs = Math.floor(discounts.length * 7.5); // 6 * 7.5 = 45
    const extraDiscountEggs = Array(totalDiscountEggs - discounts.length).fill(null).map(() => {
      const randomDiscount = discounts[Math.floor(Math.random() * discounts.length)];
      return {
        ...randomDiscount,
        code: `${randomDiscount.code}-${Math.random().toString(36).substr(2, 4)}`
      };
    });

    // Keep spoiled eggs at 15 (3x)
    const totalSpoiledEggs = Math.floor(spoiledEggs.length * 3);
    const extraSpoiledEggs = Array(totalSpoiledEggs - spoiledEggs.length).fill(null).map(() => ({
      type: 'spoiled',
      message: 'Just clay! Try again!',
      size: Math.random() > 0.5 ? 'medium' : 'small'
    }));

    // Add remaining eggs with optimized positioning
    [...discounts.filter(d => d.code !== 'POTTERY5'), ...extraDiscountEggs, ...spoiledEggs, ...extraSpoiledEggs].forEach((item, index) => {
      const sectionWidth = window.innerWidth / 6;
      const sectionHeight = pageHeight / 6;
      
      const sectionIndex = index % 36;
      const row = Math.floor(sectionIndex / 6);
      const col = sectionIndex % 6;
      
      const top = (row * sectionHeight) + (Math.random() * sectionHeight * 0.8);
      const left = (col * sectionWidth) + (Math.random() * sectionWidth * 0.8);
      
      // Only 20% of eggs will be animated
      const isAnimated = Math.random() < 0.2;
      
      elements.push({
        id: `egg-${index}`,
        type: 'egg',
        isEgg: true,
        item,
        position: {
          top,
          left,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4,
          opacity: 0.8 + Math.random() * 0.2,
          size: item.size === 'small' ? 15 + Math.random() * 5 : 20 + Math.random() * 10,
          animationDuration: isAnimated ? 8 + Math.random() * 4 : 0,
          animationDelay: isAnimated ? Math.random() * -5 : 0,
          moveRange: isAnimated ? 5 + Math.random() * 15 : 0,
          rotateRange: isAnimated ? 3 + Math.random() * 6 : 0,
          isAnimated
        }
      });
    });

    setElements(elements);
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

  const handleRedeem = (discount) => {
    setCurrentItem(discount);
    setShowModal(true);
    // Open the booking link in a new tab
    window.open(discount.link, '_blank');
  };

  const renderElement = (element, theme) => {
    const { type, position, isEgg } = element;
    const style = {
      position: 'absolute',
      top: `${position.top}px`,
      left: `${position.left}px`,
      fontSize: `${position.size}px`,
      opacity: position.opacity,
      color: isEgg ? theme.primary : theme.secondary,
      transform: `rotate(${position.rotation}deg) scale(${position.scale})`,
      transition: 'color 0.5s ease',
      cursor: isEgg ? 'pointer' : 'default',
      mixBlendMode: 'multiply',
    };

    const variants = position.isAnimated ? {
      animate: {
        y: [`${-position.moveRange}px`, `${position.moveRange}px`],
        rotate: [position.rotation - position.rotateRange, position.rotation + position.rotateRange],
        transition: {
          y: {
            duration: position.animationDuration,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: position.animationDelay,
          },
          rotate: {
            duration: position.animationDuration * 1.2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: position.animationDelay,
          },
        },
      },
    } : {};

    if (isEgg) {
      const isSpoiled = element.item.type === 'spoiled';
      
      return (
        <motion.div
          key={element.id}
          className={`egg absolute ${showDevMode ? 'ring-2 ring-red-500' : ''}`}
          style={style}
          onClick={(e) => handleEggClick(e, element.item)}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          animate={variants.animate}
          transition={{
            duration: position.animationDuration,
            delay: position.animationDelay,
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
    }[type];

    return (
      <motion.div
        key={element.id}
        className="absolute"
        style={style}
        animate={variants.animate}
        transition={{
          duration: position.animationDuration,
          delay: position.animationDelay,
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
        background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
        transition: 'background 1s ease'
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <a href="https://www.instagram.com/thepotteryloop/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
              <FaInstagram className="text-xl" />
            </a>
            <a href="https://thepotteryloop.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 transition-colors">
              <FaGlobe className="text-xl" />
            </a>
            <a href="mailto:info@thepotteryloop.com" className="text-gray-700 hover:text-gray-900 transition-colors">
              <FaEnvelope className="text-xl" />
            </a>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">@PotteryChicago Easter Egg Hunt</h1>
            <p className="text-sm text-gray-600">Find hidden discounts!</p>
          </div>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 min-h-screen">
        <section className="container mx-auto px-4 py-4 sm:py-8">
          <p className="text-base sm:text-lg text-center mb-8 sm:mb-12 text-black px-2">
            Click on the hidden eggs to discover special discounts for pottery classes!
            Codes valid for 48 hours only.
          </p>
        </section>

        {/* All Elements */}
        <div ref={containerRef} className="relative min-h-[100000px] w-full overflow-hidden">
          {elements.map(element => renderElement(element, currentTheme))}
        </div>

        {/* Easter message at the bottom */}
        <div className="text-center mt-32 mb-16">
          <div className="inline-block transform rotate-12">
            <FaSeedling className="text-6xl text-gray-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600 text-xl font-medium">
            You reached the bottom... don't know how but HAPPY EASTER! 
            <br />
            Hope to see you in the studio soon -Mike
          </p>
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
                      href={currentItem?.link}
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