"use client";

import React from "react";

export default function LunarMap() {
  return (
    <div className="w-full h-[350px] rounded-2xl overflow-hidden shadow mb-6">
      <iframe
        src="https://quickmap.lroc.asu.edu/?extent=-90,-180,90,180&proj=eq&layers=NrLROCKaguya%2Clroc_bw&camera=eq"
        title="LROC QuickMap"
        width="100%"
        height="100%"
        style={{
          border: 0,
          width: "100%",
          height: "100%",
          minHeight: 350,
          borderRadius: "1.5rem",
        }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}
