'use client';

import React from 'react';

export default function LunarMapEmbed() {
  return (
    <div className="w-full h-[400px] lg:h-full">
      <iframe
        src="https://www.google.com/maps/space/moon/"
        title="Лунная карта Google"
        width="100%"
        height="100%"
        className="w-full h-full border-none rounded-lg"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
