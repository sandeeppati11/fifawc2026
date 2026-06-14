import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Expanded database of 24 famous player profiles for the 12 Groups (2 players per group)
const groupStarPlayers = {
  'A': [
    { name: 'SON HEUNG-MIN', number: '7', country: 'SOUTH KOREA', skill: 'SPEED STRIKER', hue: '142', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Son_Heung-min_2018.jpg' },
    { name: 'GUILLERMO OCHOA', number: '13', country: 'MEXICO', skill: 'WALL KEEPER', hue: '120', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Guillermo_Ochoa_2018.jpg' }
  ],
  'B': [
    { name: 'ALPHONSO DAVIES', number: '19', country: 'CANADA', skill: 'SPEED RACER', hue: '0', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Alphonso_Davies_2021.jpg' },
    { name: 'GRANIT XHAKA', number: '10', country: 'SWITZERLAND', skill: 'MIDFIELD ANCHOR', hue: '350', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Granit_Xhaka_2018.jpg' }
  ],
  'C': [
    { name: 'NEYMAR JR.', number: '10', country: 'BRAZIL', skill: 'SAMBA DRIBBLER', hue: '45', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Neymar_Jr_2018.jpg' },
    { name: 'ACHRAF HAKIMI', number: '2', country: 'MOROCCO', skill: 'PACE OVERLAP', hue: '10', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Achraf_Hakimi_2018.jpg' }
  ],
  'D': [
    { name: 'CHRISTIAN PULISIC', number: '10', country: 'USA', skill: 'CAPTAIN AMERICA', hue: '217', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Christian_Pulisic_2022.jpg' },
    { name: 'MATHEW RYAN', number: '1', country: 'AUSTRALIA', skill: 'SPOT SAVER', hue: '200', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Mathew_Ryan_2018.jpg' }
  ],
  'E': [
    { name: 'THOMAS MÜLLER', number: '25', country: 'GERMANY', skill: 'SPACE INTERPRETER', hue: '150', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Thomas_M%C3%BCller_2018.jpg' },
    { name: 'ENNER VALENCIA', number: '13', country: 'ECUADOR', skill: 'POWER HEADER', hue: '35', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Enner_Valencia_2018.jpg' }
  ],
  'F': [
    { name: 'VIRGIL VAN DIJK', number: '4', country: 'NETHERLANDS', skill: 'THE WALL', hue: '30', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Virgil_van_Dijk_2018.jpg' },
    { name: 'KAORU MITOMA', number: '7', country: 'JAPAN', skill: 'LINE DRIBBLER', hue: '210', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Mitoma_Kaoru_2022.jpg' }
  ],
  'G': [
    { name: 'KEVIN DE BRUYNE', number: '7', country: 'BELGIUM', skill: 'VISION PASS', hue: '195', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Kevin_De_Bruyne_2018.jpg' },
    { name: 'MOHAMED SALAH', number: '11', country: 'EGYPT', skill: 'PHARAOH RUNNER', hue: '120', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Mohamed_Salah_2018.jpg' }
  ],
  'H': [
    { name: 'PEDRI', number: '26', country: 'SPAIN', skill: 'GOLDEN BOY', hue: '240', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Pedri_2021.jpg' },
    { name: 'FEDERICO VALVERDE', number: '15', country: 'URUGUAY', skill: 'FALCON RUN', hue: '185', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Federico_Valverde_2018.jpg' }
  ],
  'I': [
    { name: 'KYLIAN MBAPPÉ', number: '10', country: 'FRANCE', skill: 'JETPACE STRIKER', hue: '235', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/57/Kylian_Mbapp%C3%A9_Coppa_del_Mondo_FIFA_2018.jpg' },
    { name: 'SADIO MANÉ', number: '10', country: 'SENEGAL', skill: 'WING FLYER', hue: '135', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Sadio_Man%C3%A9_2018.jpg' }
  ],
  'J': [
    { name: 'LIONEL MESSI', number: '10', country: 'ARGENTINA', skill: 'THE MAGICIAN', hue: '190', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg' },
    { name: 'DAVID ALABA', number: '8', country: 'AUSTRIA', skill: 'DEFENSE ENGINE', hue: '0', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/David_Alaba_2020.jpg' }
  ],
  'K': [
    { name: 'CRISTIANO RONALDO', number: '7', country: 'PORTUGAL', skill: 'GOAL MACHINE', hue: '25', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg' },
    { name: 'LUIS DÍAZ', number: '14', country: 'COLOMBIA', skill: 'LINE DRIBBLER', hue: '40', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Luis_D%C3%ADaz_2021.jpg' }
  ],
  'L': [
    { name: 'HARRY KANE', number: '9', country: 'ENGLAND', skill: 'TARGET STRIKER', hue: '20', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Harry_Kane_2018.jpg' },
    { name: 'LUKA MODRIĆ', number: '10', country: 'CROATIA', skill: 'MIDFIELD GENIUS', hue: '200', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/Luka_Modri%C3%A7_2018.jpg' }
  ]
};

// 6 famous player profiles for the Knockout Stage
const roundStarPlayers = {
  'roundOf32': [
    { name: 'R. LEWANDOWSKI', number: '9', country: 'POLAND', skill: 'FOX IN THE BOX', hue: '0', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Robert_Lewandowski_2018.jpg' }
  ],
  'roundOf16': [
    { name: 'A. GRIEZMANN', number: '7', country: 'FRANCE', skill: 'TACTICAL LINK', hue: '220', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Antoine_Griezmann_2018.jpg' }
  ],
  'quarterfinals': [
    { name: 'ERLING HAALAND', number: '9', country: 'NORWAY', skill: 'THE TERMINATOR', hue: '45', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Erling_Haaland_2020.jpg' }
  ],
  'semifinals': [
    { name: 'KARIM BENZEMA', number: '9', country: 'FRANCE', skill: 'BALLON D’OR 9', hue: '240', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Karim_Benzema_2018.jpg' }
  ],
  'finals': [
    { name: 'ROMELU LUKAKU', number: '9', country: 'BELGIUM', skill: 'POWER HULK', hue: '200', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Romelu_Lukaku_2018.jpg' },
    { name: 'C. ERIKSEN', number: '10', country: 'DENMARK', skill: 'PITCH VISION', hue: '0', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Christian_Eriksen_2018.jpg' }
  ]
};

export default function ScrollPredictorLayout({ children, type = 'groups' }) {
  const containerRef = useRef(null);
  const [activeKey, setActiveKey] = useState(type === 'groups' ? 'A' : 'roundOf32');
  const [cycleIndex, setCycleIndex] = useState(0);

  // useScroll and useTransform for hardware-accelerated parallax translation on scroll
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 3000], [0, 600]);

  // Set up 5-second interval timer to switch between players in the active group/round
  useEffect(() => {
    const timer = setInterval(() => {
      setCycleIndex((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Set up viewport IntersectionObserver
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0.2
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const key = entry.target.getAttribute('data-scroll-key');
          if (key) {
            setActiveKey(key);
            setCycleIndex(0); // Reset timer cycle when group/round switches
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const elementsToObserve = containerRef.current?.querySelectorAll('[data-scroll-key]') || [];
    elementsToObserve.forEach((el) => observer.observe(el));

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [children]);

  // Extract active list
  const activeList = type === 'groups' 
    ? groupStarPlayers[activeKey] || groupStarPlayers['A']
    : roundStarPlayers[activeKey] || roundStarPlayers['roundOf32'];

  // Select current superstar from active group/round list
  const activePlayer = activeList[cycleIndex % activeList.length];
  const playerHue = activePlayer?.hue || '142';

  return (
    <div ref={containerRef} className="relative w-full min-h-screen overflow-x-hidden">
      
      {/* ======================================================== */}
      {/* HOLOGRAPHIC BACKGROUND LAYER (Fixed, lower z-index, z-0) */}
      {/* ======================================================== */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden pitch-lawn">
        
        {/* Soccer Pitch Overlay Lines */}
        <svg viewBox="0 0 100 200" className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" preserveAspectRatio="none">
          <rect x="2" y="2" width="96" height="196" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <line x1="2" y1="100" x2="98" y2="100" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="50" cy="100" r="18" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="50" cy="100" r="1" fill="#ffffff" />
          <rect x="25" y="2" width="50" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <rect x="38" y="2" width="24" height="10" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="50" cy="22" r="1" fill="#ffffff" />
          <path d="M 38 32 A 15 15 0 0 0 62 32" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <rect x="25" y="168" width="50" height="30" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <rect x="38" y="188" width="24" height="10" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <circle cx="50" cy="178" r="1" fill="#ffffff" />
          <path d="M 38 168 A 15 15 0 0 1 62 168" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <path d="M 2 7 A 5 5 0 0 0 7 2" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <path d="M 98 7 A 5 5 0 0 1 93 2" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <path d="M 2 193 A 5 5 0 0 1 7 198" fill="none" stroke="#ffffff" strokeWidth="0.5" />
          <path d="M 98 193 A 5 5 0 0 0 93 198" fill="none" stroke="#ffffff" strokeWidth="0.5" />
        </svg>
        
        {/* Futuristic neon grid background */}
        <div 
          className="absolute inset-0 opacity-[0.04] transition-all duration-700"
          style={{
            backgroundImage: `linear-gradient(to right, hsl(${playerHue}, 100%, 50%) 1px, transparent 1px), linear-gradient(to bottom, hsl(${playerHue}, 100%, 50%) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Cybernetic horizontal scanline filter */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,20,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] opacity-30 mix-blend-overlay" />

        {/* Golden/Emerald Stadium Light cones */}
        <div 
          className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.06] transition-all duration-1000"
          style={{ backgroundColor: `hsl(${playerHue}, 100%, 50%)` }}
        />
        <div 
          className="absolute -bottom-40 right-1/4 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.04] transition-all duration-1000"
          style={{ backgroundColor: `hsl(${playerHue}, 100%, 50%)` }}
        />

        {/* Parallax Hologram Graphic */}
        <motion.div 
          style={{ y: yBg }} 
          className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeKey}-${cycleIndex % activeList.length}`}
              initial={{ opacity: 0, scale: 0.85, y: 35 }}
              animate={{ opacity: 0.75, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -35 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[92vw] max-w-[440px] h-[540px] flex items-center justify-center p-4"
            >
              {/* Giant cybernetic tactical circle grid in neon */}
              <svg 
                viewBox="0 0 400 400" 
                className="w-[280px] h-[280px] md:w-[360px] md:h-[360px] absolute opacity-30 animate-[spin_55s_linear_infinite]"
                style={{ color: `hsl(${playerHue}, 100%, 50%)` }}
              >
                <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 5" fill="none" />
                <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="1" strokeDasharray="15 35" fill="none" />
                <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.5" fill="none" />
              </svg>

              {/* Holographic Tactical HUD Frame Overlay */}
              <div 
                className="absolute w-[260px] h-[340px] md:w-[320px] md:h-[400px] border rounded-3xl transition-all duration-700 flex flex-col justify-between p-6 opacity-[0.4] shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]"
                style={{ borderColor: `hsla(${playerHue}, 100%, 50%, 0.35)` }}
              >
                {/* HUD Corners */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2" style={{ borderColor: `hsl(${playerHue}, 100%, 50%)` }} />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2" style={{ borderColor: `hsl(${playerHue}, 100%, 50%)` }} />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2" style={{ borderColor: `hsl(${playerHue}, 100%, 50%)` }} />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2" style={{ borderColor: `hsl(${playerHue}, 100%, 50%)` }} />

                {/* Country / Stat Data */}
                <div className="text-left font-mono">
                  <span className="text-[9px] font-black uppercase block tracking-widest opacity-60 text-white">ACTIVE STAR</span>
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400">{activePlayer?.country}</span>
                </div>

                {/* Tactical stats box */}
                <div className="text-right font-mono self-end">
                  <span className="text-[9px] font-black uppercase block tracking-widest opacity-60 text-white">SKILL PROFILE</span>
                  <span className="text-xs font-black uppercase tracking-wider text-white">{activePlayer?.skill}</span>
                </div>
              </div>

              {/* Holographic Player Photo with Hue Filters & Scanline Overlays */}
              <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden flex items-center justify-center border-4 border-double transition-colors duration-700 shadow-[0_0_35px_rgba(0,0,0,0.4)]"
                   style={{ borderColor: `hsla(${playerHue}, 100%, 50%, 0.5)` }}>
                {/* Gray Scale Duotone dynamic filter applied to player photo */}
                <img
                  src={activePlayer?.imageUrl}
                  alt={activePlayer?.name}
                  className="w-full h-full object-cover transition-all duration-700 filter"
                  style={{
                    filter: `grayscale(100%) brightness(85%) contrast(135%) sepia(85%) hue-rotate(${playerHue - 55}deg) saturate(180%)`,
                  }}
                />
                {/* Scanline overlay directly on player portrait */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none rounded-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent pointer-events-none rounded-full" />
              </div>

              {/* Dynamic text background panels */}
              <div className="absolute flex flex-col justify-center items-center pointer-events-none">
                <span className="text-[120px] md:text-[160px] font-black leading-none opacity-[0.25] text-center tracking-tight select-none pointer-events-none filter blur-[1px]">
                  {activePlayer?.number}
                </span>
                <span className="text-sm font-black tracking-widest text-center uppercase -mt-5 opacity-[0.85] px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-900 rounded-xl text-white shadow-md">
                  {activePlayer?.name}
                </span>
              </div>

            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ======================================================== */}
      {/* SCROLL CONTENT LAYER (Higher z-index, z-10) */}
      {/* ======================================================== */}
      <div className="relative z-10 w-full min-h-screen">
        {children}
      </div>

    </div>
  );
}
