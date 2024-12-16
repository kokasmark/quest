import React, { useState, useEffect } from 'react';
import './EmojiParticle.css'; // This is where the animation styles will go

const EmojiParticle = ({ emoji, startX, startY }) => {
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [opacity, setOpacity] = useState(1);

 

  return (
    <div
      className="emoji-particle"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity: opacity,
      }}
    >
      {emoji}
    </div>
  );
};

export default EmojiParticle;
