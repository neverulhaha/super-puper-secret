"use client";
import React from "react";

export default function LunarMapEmbed() {
  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow mb-6">
      <iframe
        src="https://pilot.wr.usgs.gov/#polygon"
        title="USGS Moon Image Database"
        width="100%"
        height="100%"
        style={{
          border: 0,
          minHeight: 400,
          width: "100%",
          height: "100%",
        }}
        allowFullScreen
      />
    </div>
  );
}
