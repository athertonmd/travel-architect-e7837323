
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useSession } from '@supabase/auth-helpers-react';
import { Json } from "@/integrations/supabase/types";

interface Notification {
  id: string;
  trip_id: string;
  sent_by: string;
  sent_at: string;
  recipients: Json;
  trip: {
    title: string;
  } | null;
  profiles: {
    username: string | null;
  } | null;
}

export default function Notifications() {
  const session = useSession();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sent_notifications')
        .select(`
          *,
          trip:trips(title),
          profiles:profiles!sent_notifications_sent_by_fkey(username)
        `)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      return (data as unknown) as Notification[];
    },
    enabled: !!session
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Sent Notifications</h1>
          <p className="text-sm text-muted-foreground">
            A history of all sent trip itineraries
          </p>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trip Name</TableHead>
                <TableHead>Traveller</TableHead>
                <TableHead>Sent By</TableHead>
                <TableHead>Sent At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">
                    {notification.trip?.title}
                  </TableCell>
                  <TableCell>
                    {Array.isArray(notification.recipients) 
                      ? notification.recipients.join(", ")
                      : String(notification.recipients)}
                  </TableCell>
                  <TableCell>
                    {notification.profiles?.username || "Unknown User"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(notification.sent_at), "PPpp")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}

