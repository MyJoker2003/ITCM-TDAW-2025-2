import React from 'react';

const History = ({ history, onSelect }) => {
    if (!history.length) return null;

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '10px' }}>Recent Searches</div>
            <div className="history-chips">
                {history.map((city, index) => (
                    <div key={index} className="chip" onClick={() => onSelect(city)}>
                        {city}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
