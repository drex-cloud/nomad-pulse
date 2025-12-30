import React, { useState, useEffect } from 'react';
import MapComponent from './components/MapComponent';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Passport from './components/Passport';

function App() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [prevCountryName, setPrevCountryName] = useState(null);
  const [lastCoords, setLastCoords] = useState(null);
  const [warpDistance, setWarpDistance] = useState(0);
  const [showToast, setShowToast] = useState(null);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const [visitedCountries, setVisitedCountries] = useState(() => {
    const saved = localStorage.getItem('nomadPulse_visited');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('nomadPulse_visited', JSON.stringify([...visitedCountries]));
  }, [visitedCountries]);

  const resetProgress = () => {
    setVisitedCountries(new Set());
    localStorage.removeItem('nomadPulse_visited');
    setWarpDistance(0);
    setLastCoords(null);
    setPrevCountryName(null);
    setSelectedCountry(null);
    setIsPassportOpen(false);
  };

  const handleCountrySelect = (name, newCoords) => {
    if (!name) return;
    if (lastCoords && newCoords && name !== selectedCountry) {
      setPrevCountryName(selectedCountry);
      const R = 6371;
      const dLat = (newCoords.lat - lastCoords.lat) * Math.PI / 180;
      const dLon = (newCoords.lng - lastCoords.lng) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lastCoords.lat * Math.PI / 180) * Math.cos(newCoords.lat * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setWarpDistance(Math.round(R * c));
    }
    setLastCoords(newCoords);
    setSelectedCountry(name);
    if (!visitedCountries.has(name)) {
      setVisitedCountries(prev => new Set(prev).add(name));
      setShowToast(`New Discovery: ${name}`);
      setTimeout(() => setShowToast(null), 3000);
    }
  };

  return (
    <main className="relative w-full h-screen bg-black select-none overflow-hidden">
      <MapComponent setSelectedCountry={handleCountrySelect} />
      <Navbar count={visitedCountries.size} />

      {/* RE-POSITIONED PASSPORT BUTTON */}
      <button
        onClick={() => setIsPassportOpen(true)}
        style={{
          position: 'fixed',
          bottom: '120px',
          left: '20px',
          zIndex: 1000, // Elevated z-index
          background: 'rgba(0,0,0,0.8)',
          border: '1px solid #10b981',
          color: '#10b981',
          padding: '12px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: '900',
          fontSize: '10px',
          letterSpacing: '2px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
        }}
      >
        PASSPORT
      </button>

      <Sidebar
        key={selectedCountry || 'empty'}
        countryName={selectedCountry}
        prevCountryName={prevCountryName}
        warpDistance={warpDistance}
        onClose={() => { setSelectedCountry(null); setWarpDistance(0); }}
      />

      <Passport
        visitedCountries={[...visitedCountries]}
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        onReset={resetProgress}
      />
    </main>
  );
}

export default App;