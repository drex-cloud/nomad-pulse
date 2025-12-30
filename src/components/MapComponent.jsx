import React, { useRef } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZGFuaWVsbXdvbmdlbGEiLCJhIjoiY21qaWRsbmk0MGwyYjNmc2xxMnk0bGczNCJ9.ll_48iPrGJtyWinFb3FlGg';

const MapComponent = ({ setSelectedCountry }) => {
  const mapRef = useRef();
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'));

  // --- RECURSIVE LAND FINDER FOR SURPRISE ME ---
  const teleportRandom = async () => {
    if (!mapRef.current) return;

    let randomLng, randomLat;
    let foundCountry = null;
    let attempts = 0;

    while (!foundCountry && attempts < 30) {
      randomLng = (Math.random() * 360) - 180;
      randomLat = (Math.random() * 120) - 50;

      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${randomLng},${randomLat}.json?types=country&access_token=${MAPBOX_TOKEN}`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          foundCountry = data.features[0].text;
        }
      } catch (e) { console.error("Search error:", e); }
      attempts++;
    }

    if (foundCountry) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => { });

      mapRef.current.flyTo({
        center: [randomLng, randomLat],
        zoom: 4,
        duration: 3000,
        pitch: 45,
        essential: true
      });

      // FIX: Passing coordinates to App.jsx for distance calculation
      setTimeout(() => setSelectedCountry(foundCountry, { lat: randomLat, lng: randomLng }), 3100);
    }
  };

  // --- CLICK HANDLER (SATELLITE LOOKUP) ---
  const onMapClick = async (event) => {
    const { lng, lat } = event.lngLat;
    console.log(`🛰️ Satellite Lock-on: ${lng}, ${lat}`);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?types=country&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const countryName = data.features[0].text;
        console.log("📍 Location Verified:", countryName);

        // FIX: Passing coordinates to App.jsx for distance calculation
        setSelectedCountry(countryName, { lat, lng });

        mapRef.current.flyTo({
          center: [lng, lat],
          zoom: 4.5,
          duration: 1500,
          essential: true
        });
      } else {
        console.log("🌊 Deep Water: No land detected.");
      }
    } catch (err) {
      console.error("📡 Uplink Error:", err);
    }
  };

  return (
    <div className="w-full h-full relative bg-black overflow-hidden z-0">
      <button
        onClick={(e) => { e.stopPropagation(); teleportRandom(); }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[500] bg-emerald-500 text-black font-black px-10 py-4 rounded-full shadow-[0_0_50px_rgba(16,185,129,0.6)] uppercase italic active:scale-95 transition-all cursor-pointer border-none"
      >
        Initiate Warp
      </button>

      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{ longitude: 0, latitude: 20, zoom: 1.8 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        projection="globe"
        onClick={onMapClick}
        style={{ width: '100vw', height: '100vh' }}
        onStyleLoad={(e) => {
          e.target.setFog({
            'color': 'rgb(10, 20, 40)',
            'high-color': 'rgb(30, 60, 150)',
            'horizon-blend': 0.05,
            'space-color': 'rgb(0, 0, 0)',
            'star-intensity': 0.8
          });
        }}
      />
    </div>
  );
};

export default MapComponent;