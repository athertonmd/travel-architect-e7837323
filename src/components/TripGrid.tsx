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
  status: "draft" | "in-progress" | "confirmed";
  archived?: boolean;
}

interface TripGridProps {
  trips: Trip[];
  isLoading: boolean;
}

export function TripGrid({ trips, isLoading }: TripGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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