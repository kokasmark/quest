import React, { useState, useEffect } from 'react';
import './EmojiParticle.css'; // This is where the animation styles will go

const EmojiParticle = ({ emoji, startX, startY,delay }) => {
  return (
    <div
      className="emoji-particle"
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        animationDelay: `${delay}s`
      }}
    >
      {emoji}
    </div>
  );
};

export default EmojiParticle;
