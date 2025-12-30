import React from 'react';

const Passport = ({ visitedCountries, isOpen, onClose, onReset }) => {
  const progress = Math.round((visitedCountries.length / 195) * 100);

  return (
    <div
      style={{
        position: 'fixed', bottom: isOpen ? '0' : '-400px', left: '0',
        width: '100%', height: '350px',
        backgroundColor: 'rgba(0, 0, 0, 0.98)', backdropFilter: 'blur(35px)',
        borderTop: '2px solid #10b981', borderRadius: '30px 30px 0 0',
        zIndex: 2000000, transition: 'bottom 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '30px', color: 'white', boxShadow: '0 -20px 100px rgba(0,0,0,1)', textAlign: 'left'
      }}
      className="crt-overlay"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '11px', color: '#10b981', letterSpacing: '4px', fontWeight: '900' }}>DISCOVERY_LOG</h3>
            <p style={{ margin: 0, opacity: 0.4, fontSize: '9px' }}>ENTRIES: {visitedCountries.length}</p>
          </div>
          <div style={{ textAlign: 'left', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '15px' }}>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: '#10b981' }}>{progress}%</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onReset}
            style={{ background: 'transparent', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.3)', padding: '8px 12px', borderRadius: '10px', fontSize: '9px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            PURGE
          </button>
          <button
            onClick={onClose}
            style={{ background: '#10b981', color: 'black', border: 'none', padding: '8px 20px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', fontSize: '10px' }}
          >
            ✕
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '20px' }} className="custom-scrollbar">
        {visitedCountries.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', width: '100%' }}>
            <p style={{ opacity: 0.3, fontStyle: 'italic', fontSize: '12px' }}>Awaiting orbital data...</p>
          </div>
        ) : (
          visitedCountries.map((country) => (
            <div key={country} style={{
              flexShrink: 0, width: '120px', background: 'rgba(255,255,255,0.03)',
              padding: '15px', borderRadius: '15px', border: '1px solid rgba(16, 185, 129, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ height: '50px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: '900', fontSize: '12px' }}>
                {country.substring(0, 3).toUpperCase()}
              </div>
              <p style={{ fontSize: '9px', fontWeight: 'bold', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{country}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Passport;