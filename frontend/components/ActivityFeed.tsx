"use client";

import { Activity, Clock, Hash } from "lucide-react";

interface ActivityFeedProps {
  events: any[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="p-2 bg-pink-500/20 rounded-xl">
          <Activity className="w-5 h-5 text-pink-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Live Activity</h3>
      </div>
      
      <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
        {events.length === 0 ? (
          <div className="p-10 text-center text-slate-500 italic">
            Waiting for contract events...
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {events.map((event, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="flex items-center gap-2 text-sm font-medium text-emerald-400">
                    <Hash className="w-3 h-3" />
                    Counter Incremented
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[150px]">
                    {event.contractId}
                  </p>
                  <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">
                    Value: {event.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
