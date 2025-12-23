"use client";

import React, { useState, useMemo } from "react";
import { Calculator, MapPin, ExternalLink } from "lucide-react";

/**
 * Dental Implant Cost Calculator (Standalone Widget)
 * 
 * This component provides estimated costs for dental implants based on:
 * - Implant Type (Single, Multiple, All-on-4, Full Mouth)
 * - Material Quality (Standard Titanium vs Premium Zirconia)
 * - Additional Procedures (Bone Graft, Extraction)
 * - Geographic Location (Simple Zip-code based modifiers)
 * 
 * Powered by FixmysmileAI (https://fixmysmile.ai)
 */
export default function DentalImplantCalculator() {
  const [zipCode, setZipCode] = useState("");
  const [implantType, setImplantType] = useState("single");
  const [quality, setQuality] = useState("standard");
  const [addOns, setAddOns] = useState({
    boneGraft: false,
    extraction: false,
  });

  const BASE_PRICES = { 
    single: 4500, 
    multiple: 12500, 
    "all-on-4": 24000, 
    "full-mouth": 48000 
  };
  
  const ADD_ON_COSTS = { 
    boneGraft: 800, 
    extraction: 350 
  };
  
  const QUALITY_MULTIPLIER = { 
    standard: 1.0, 
    premium: 1.25 
  };

  const costs = useMemo(() => {
    let base = BASE_PRICES[implantType as keyof typeof BASE_PRICES] || 0;
    if (addOns.boneGraft) base += ADD_ON_COSTS.boneGraft;
    if (addOns.extraction) base += ADD_ON_COSTS.extraction;
    base *= QUALITY_MULTIPLIER[quality as keyof typeof QUALITY_MULTIPLIER];

    // Geographic Modifiers (Mock Data)
    let geoMod = 1.0;
    // West Coast & East Coast typically higher
    if (zipCode.startsWith("9") || zipCode.startsWith("1")) geoMod = 1.2;
    // North East
    if (zipCode.startsWith("0") || zipCode.startsWith("2")) geoMod = 1.1; 
    // South / Midwest typically lower
    if (zipCode.startsWith("3") || zipCode.startsWith("7")) geoMod = 0.9;

    const total = Math.round(base * geoMod);
    
    return {
      totalMin: Math.round(total * 0.9),
      totalMax: Math.round(total * 1.1),
      monthly: Math.round(total / 60), // Simple 60-month financing estimate
    };
  }, [implantType, quality, addOns, zipCode]);

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden font-sans text-gray-900 my-8">
      {/* Header */}
      <div className="bg-blue-600 p-6 text-white text-center">
        <div className="flex justify-center mb-2">
           <Calculator className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">Implant Cost Estimator</h2>
        <p className="text-blue-100 text-xs mt-1 uppercase tracking-widest font-semibold">2025 Market Data</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Zip Code Input */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5" /> Zip Code
          </label>
          <input 
            type="text" 
            placeholder="e.g. 90210"
            className="w-full h-11 px-4 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
            maxLength={5}
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g,''))}
          />
        </div>

        {/* Type & Material Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Implant Type</label>
            <select 
              className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none cursor-pointer hover:bg-white transition-colors"
              value={implantType}
              onChange={(e) => setImplantType(e.target.value)}
            >
              <option value="single">Single Tooth</option>
              <option value="multiple">Multiple (3-4)</option>
              <option value="all-on-4">All-on-4</option>
              <option value="full-mouth">Full Mouth</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase block mb-2">Material</label>
            <select 
              className="w-full h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm outline-none cursor-pointer hover:bg-white transition-colors"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="standard">Titanium</option>
              <option value="premium">Zirconia</option>
            </select>
          </div>
        </div>

        {/* Additional Procedures */}
        <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={addOns.boneGraft}
                    onChange={() => setAddOns(p => ({...p, boneGraft: !p.boneGraft}))}
                />
                <span className="text-sm font-medium text-gray-700">Bone Grafting</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={addOns.extraction}
                    onChange={() => setAddOns(p => ({...p, extraction: !p.extraction}))}
                />
                <span className="text-sm font-medium text-gray-700">Extraction</span>
            </label>
        </div>

        {/* Result Area */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">Estimated Range</p>
              <div className="text-2xl font-black">
                ${costs.totalMin.toLocaleString()} - ${costs.totalMax.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-1">Est. Monthly</p>
              <div className="text-2xl font-black text-green-400">
                ${costs.monthly}<span className="text-xs text-gray-400 ml-1">/mo</span>
              </div>
            </div>
          </div>

          <a 
            href="https://fixmysmile.ai/dental-implants-cost-calculator?utm_source=github&utm_medium=open-source"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform active:scale-95 text-sm"
          >
            Get Detailed Quote <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Powered By */}
        <div className="text-center pt-2">
            <p className="text-[10px] text-gray-400">
              Tool provided by <a href="https://fixmysmile.ai" className="text-blue-500 font-bold hover:underline" target="_blank" rel="noopener">FixmysmileAI</a>
            </p>
        </div>
      </div>
    </div>
  );
}
