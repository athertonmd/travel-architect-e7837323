
import { TripCard } from "./TripCard";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { EmptyTrips } from "./EmptyTrips";

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  status: "draft" | "sent";
  archived?: boolean;
  segments?: any[];
}

interface TripGridProps {
  trips: Trip[];
  isLoading: boolean;
}

export function TripGrid({ trips, isLoading }: TripGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
      {isLoading ? (
        <LoadingSkeleton />
      ) : trips.length > 0 ? (
        trips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))
      ) : (
        <EmptyTrips />
      )}
    </div>
  );
}
