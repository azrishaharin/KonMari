'use client';

import React from 'react';
import { useApp } from '@/contexts/app-context';
import { 
  Calendar, 
  Clock, 
  Phone,
  MessageSquare,
  MapPin,
  CheckCircle,
  Info
} from 'lucide-react';
import { format, addDays } from 'date-fns';

const PICKUP_DAYS = ['Monday', 'Wednesday', 'Friday'];
const PICKUP_START_HOUR = 20; // 8 PM
const PICKUP_END_HOUR = 22; // 10 PM

function getNextPickupDay(): string {
  const today = new Date();
  const currentHour = today.getHours();
  const currentDay = format(today, 'EEEE');
  
  if (PICKUP_DAYS.includes(currentDay) && currentHour < PICKUP_END_HOUR) {
    return currentDay;
  }

  let nextDate = today;
  let nextDay: string;
  do {
    nextDate = addDays(nextDate, 1);
    nextDay = format(nextDate, 'EEEE');
  } while (!PICKUP_DAYS.includes(nextDay));

  return nextDay;
}

function isPickupTime(): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = format(now, 'EEEE');

  return (
    PICKUP_DAYS.includes(currentDay) &&
    currentHour >= PICKUP_START_HOUR &&
    currentHour < PICKUP_END_HOUR
  );
}

export default function PickupsPage() {
  const { dailyPickups, markPickupComplete } = useApp();
  const nextPickupDay = getNextPickupDay();
  const isPickupActive = isPickupTime();

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/\+/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleComplete = async (customerId: string) => {
    if (!isPickupActive) return;
    try {
      await markPickupComplete(customerId);
    } catch (error) {
      console.error('Error completing pickup:', error);
    }
  };

  // Separate completed and pending pickups
  const pendingPickups = dailyPickups.filter(pickup => !pickup.is_completed);
  const completedPickups = dailyPickups.filter(pickup => pickup.is_completed);

  // Sort pickups by name
  const sortByName = (a: typeof dailyPickups[0], b: typeof dailyPickups[0]) => 
    a.name.localeCompare(b.name);

  const sortedPendingPickups = [...pendingPickups].sort(sortByName);
  const sortedCompletedPickups = [...completedPickups].sort(sortByName);

  const PickupCard = ({ pickup }: { pickup: typeof dailyPickups[0] }) => {
    return (
      <div 
        className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 ${
          pickup.is_completed ? 'border-green-500' : 'border-blue-500'
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-grow">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {pickup.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-4 w-4 mr-1" />
              {pickup.address}
            </div>
            <div className="flex space-x-3 mt-3">
              <button
                onClick={() => handleCall(pickup.phone)}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <Phone className="h-3 w-3 mr-1" />
                Call
              </button>
              <button
                onClick={() => handleWhatsApp(pickup.phone)}
                className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                WhatsApp
              </button>
            </div>
          </div>
          {!pickup.is_completed && (
            <button
              onClick={() => handleComplete(pickup.customer_id)}
              disabled={!isPickupActive}
              className={`p-2 rounded-full transition-colors ${
                isPickupActive
                  ? 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                  : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
              }`}
              title={isPickupActive ? 'Mark as completed' : 'Pickup time not started'}
            >
              <CheckCircle className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Pickup Schedule
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {nextPickupDay === format(new Date(), 'EEEE') 
              ? "Today's pickups"
              : `Next pickup day: ${nextPickupDay}`
            }
          </p>
        </div>
        <div className={`text-sm ${isPickupActive ? 'text-green-500' : 'text-gray-500'} dark:text-gray-400`}>
          <Clock className="h-4 w-4 inline-block mr-1" />
          8:00 PM - 10:00 PM
        </div>
      </div>

      {!isPickupActive && (
        <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg flex items-center gap-2 text-sm text-blue-700 dark:text-blue-200">
          <Info className="h-5 w-5 flex-shrink-0" />
          <p>Pickup completion is only available between 8:00 PM and 10:00 PM on pickup days.</p>
        </div>
      )}

      {/* Upcoming Pickups */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          Upcoming Pickups ({sortedPendingPickups.length})
        </h2>
        <div className="grid gap-4">
          {sortedPendingPickups.map((pickup) => (
            <PickupCard key={pickup.customer_id} pickup={pickup} />
          ))}
        </div>
      </div>

      {/* Completed Pickups */}
      {sortedCompletedPickups.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Completed Pickups ({sortedCompletedPickups.length})
          </h2>
          <div className="grid gap-4">
            {sortedCompletedPickups.map((pickup) => (
              <PickupCard key={pickup.customer_id} pickup={pickup} />
            ))}
          </div>
        </div>
      )}

      {dailyPickups.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No pickups scheduled for {nextPickupDay}</p>
        </div>
      )}
    </div>
  );
} 