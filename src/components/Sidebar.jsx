import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ countryName, prevCountryName, warpDistance, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [localTime, setLocalTime] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // --- RESPONSIVE LISTENER ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- WEATHER ICON LOGIC ---
  const getWeatherIcon = (condition) => {
    const map = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⛈️", Snow: "❄️", Mist: "🌫️", Haze: "🌫️" };
    return map[condition] || "🛰️";
  };

  // --- DATA FETCHING ---
  useEffect(() => {
    if (!countryName) return;
    const getPulseData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
        const country = res.data[0];
        setData(country);

        if (country.capitalInfo?.latlng) {
          const [lat, lon] = country.capitalInfo.latlng;
          const wRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4c9fcbbdbff6343d0a002a52050aa07c&units=metric`);
          setWeather(wRes.data);

          // Update Time
          const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
          const nd = new Date(utc + (1000 * wRes.data.timezone));
          setLocalTime(nd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
        }
      } catch (err) {
        console.error("API Fetch Error");
      } finally { setLoading(false); }
    };
    getPulseData();
  }, [countryName]);

  if (!countryName) return null;

  // --- DYNAMIC POSITIONING ---
  const mobileStyles = {
    bottom: '0', left: '0', width: '100%', height: '70vh',
    borderRadius: '30px 30px 0 0', borderTop: '2px solid rgba(16, 185, 129, 0.5)'
  };

  const desktopStyles = {
    top: '50%', right: '40px', transform: 'translateY(-50%)',
    width: '420px', height: 'auto', maxHeight: '95vh',
    borderRadius: '30px', borderLeft: '2px solid rgba(16, 185, 129, 0.5)'
  };

  return (
    <div
      style={{
        position: 'fixed', backgroundColor: 'rgba(0, 0, 0, 0.96)',
        backdropFilter: 'blur(25px)', color: 'white', zIndex: 999999,
        display: 'flex', flexDirection: 'column', boxShadow: '0 0 100px rgba(0,0,0,1)',
        overflow: 'hidden', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        ...(isMobile ? mobileStyles : desktopStyles)
      }}
      className="crt-overlay"
    >
      {/* HEADER: SECTOR STATUS & TIME */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', background: 'rgba(16,185,129,0.08)' }}>
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#10b981', fontWeight: 'bold', letterSpacing: '4px' }}>SECTOR_LOCKED</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: '900', fontFamily: 'monospace', color: '#10b981' }}>{localTime || "00:00:00"}</p>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', borderRadius: '50%', width: '35px', height: '35px', cursor: 'pointer' }}>✕</button>
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={{ padding: '25px', overflowY: 'auto', textAlign: 'left' }} className="custom-scrollbar">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p className="animate-pulse text-emerald-500 font-mono">UPLINKING_DATA...</p>
          </div>
        ) : data ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* IDENTITY CARD */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <img src={data.flags.svg} style={{ width: '100px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }} alt="flag" />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: isMobile ? '28px' : '42px', fontStyle: 'italic', fontWeight: '900', letterSpacing: '-2px', lineHeight: 0.9 }}>{data.name.common}</h2>
                <p style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold', marginTop: '5px' }}>{data.region.toUpperCase()} / {data.cca3}</p>
              </div>
            </div>

            {/* ATMOSPHERE HUD WITH ICON */}
            <div style={{ padding: '20px', background: 'linear-gradient(145deg, rgba(255,255,255,0.05), transparent)', borderRadius: '25px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20px', right: '25px', fontSize: '50px' }}>
                {weather ? getWeatherIcon(weather.weather[0].main) : "🛰️"}
              </div>
              <p style={{ fontSize: '10px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>ATMOSPHERE_PULSE</p>
              {weather && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '38px', fontWeight: '300' }}>{Math.round(weather.main.temp)}°C</span>
                  <span style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>{weather.weather[0].description}</span>
                </div>
              )}
            </div>

            {/* WARP TELEMETRY */}
            <div style={{ padding: '20px', background: 'rgba(16,185,129,0.12)', border: '1px solid #10b981', borderRadius: '25px' }}>
              <p style={{ fontSize: '10px', color: '#10b981', margin: '0 0 10px 0', fontWeight: 'bold' }}>WARP_TELEMETRY</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <p style={{ fontSize: '10px', margin: 0, opacity: 0.6, fontStyle: 'italic' }}>
                  {prevCountryName || "DEEP_SPACE"} &gt;&gt; {countryName}
                </p>
                <p style={{ fontSize: '28px', margin: 0, fontWeight: '900' }}>{warpDistance.toLocaleString()} <span style={{ fontSize: '14px', color: '#10b981' }}>KM</span></p>
              </div>
            </div>

            {/* LIVE SYSTEM LOGS (The Scrollable Timeline) */}
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ fontSize: '9px', opacity: 0.5, marginBottom: '10px', fontWeight: 'bold' }}>SYSTEM_LOGS</p>
              <div style={{ fontSize: '10px', fontFamily: 'monospace', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '10px' }}>
                  <span style={{ color: '#10b981' }}>[{localTime}]</span> UPLINK_ESTABLISHED
                </div>
                <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '10px' }}>
                  <span style={{ color: '#10b981' }}>[{localTime}]</span> GEOGRAPHIC_SCAN_COMPLETE
                </div>
                <div style={{ borderLeft: '2px solid #10b981', paddingLeft: '10px' }}>
                  <span style={{ color: '#10b981' }}>[{localTime}]</span> {data.currencies ? Object.values(data.currencies)[0].name : "CURRENCY"} IDENTIFIED
                </div>
              </div>
            </div>

            {/* TECH GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '18px' }}>
                <p style={{ fontSize: '9px', opacity: 0.4, margin: 0 }}>POPULATION</p>
                <p style={{ margin: '5px 0 0 0', fontWeight: '900', fontSize: '20px' }}>{(data.population / 1000000).toFixed(1)}M</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '15px', borderRadius: '18px' }}>
                <p style={{ fontSize: '9px', opacity: 0.4, margin: 0 }}>LANGUAGES</p>
                <p style={{ margin: '5px 0 0 0', fontWeight: '900', fontSize: '14px', color: '#10b981' }}>{Object.values(data.languages || {})[0]}</p>
              </div>
            </div>

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Sidebar;