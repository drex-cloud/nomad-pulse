import React from 'react';

const Navbar = ({ count }) => {
  const percentage = Math.round((count / 195) * 100);

  return (
    <nav className="absolute top-4 md:top-8 left-0 w-full px-4 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 z-[100] pointer-events-none">
      {/* Branding Section */}
      <div className="pointer-events-auto bg-black/60 backdrop-blur-lg border border-white/10 p-3 md:p-4 rounded-2xl text-white shadow-2xl">
        <h1 className="font-black italic tracking-tighter text-xl md:text-2xl leading-none">NOMADPULSE</h1>
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-emerald-400 mt-1">Exploration HUD</p>
      </div>

      {/* Discovery Progress Section - Hidden on very small screens, or scaled down */}
      <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-4 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Global Discovery</span>
          <div className="flex items-center gap-3">
            <div className="h-1 w-24 md:w-32 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-1000 shadow-[0_0_10px_#10b981]"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span className="text-emerald-400 font-mono font-bold text-xs md:text-sm">{percentage}%</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;