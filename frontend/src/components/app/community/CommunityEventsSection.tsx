"use client";

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle2, Video, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_COMMUNITY_EVENTS, CommunityEvent } from '@/lib/mockCommunityData';

export const CommunityEventsSection: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>(MOCK_COMMUNITY_EVENTS);

  const toggleRSVP = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === id) {
          const nextRSVP = !evt.isRSVPed;
          return {
            ...evt,
            isRSVPed: nextRSVP,
            attendeesCount: nextRSVP ? evt.attendeesCount + 1 : evt.attendeesCount - 1,
          };
        }
        return evt;
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Upcoming Community Events & Workshops
        </h3>
        <span className="text-[11px] font-extrabold text-slate-400">
          {events.length} upcoming events
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {events.map((evt) => (
          <div
            key={evt.id}
            className="bg-white dark:bg-[#06140e] border border-emerald-100 dark:border-emerald-900/50 hover:border-emerald-300 dark:hover:border-emerald-700/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            {/* Event Header Image */}
            <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-900">
              <img src={evt.image} alt={evt.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm">
                  {evt.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-900/80 text-white backdrop-blur-sm">
                  {evt.mode}
                </span>
              </div>
            </div>

            {/* Event Body */}
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {evt.date}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" /> {evt.time}
                  </span>
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">
                  {evt.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-2">
                  {evt.description}
                </p>
              </div>

              {/* Location & RSVP */}
              <div className="pt-3 border-t border-slate-100 dark:border-emerald-900/40 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5 line-clamp-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {evt.location}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 shrink-0">
                    <Users className="w-3.5 h-3.5" /> {evt.attendeesCount}
                  </span>
                </div>

                <Button
                  onClick={() => toggleRSVP(evt.id)}
                  size="sm"
                  className={`w-full rounded-2xl font-extrabold text-xs h-10 border transition-all cursor-pointer ${
                    evt.isRSVPed
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-0 shadow-sm'
                  }`}
                >
                  {evt.isRSVPed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" /> Attending Event
                    </>
                  ) : (
                    'RSVP / Join Event'
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
