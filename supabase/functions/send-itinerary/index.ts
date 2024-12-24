import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  tripId: string;
  recipients: string[];
}

const formatItinerary = (segments: any[]) => {
  let itinerary = '';
  segments.forEach((segment, index) => {
    const details = segment.details || {};
    const type = segment.type.charAt(0).toUpperCase() + segment.type.slice(1);
    
    itinerary += `<div style="margin-bottom: 20px;">
      <h3 style="color: #1a365d;">${index + 1}. ${type}</h3>`;

    if (type === 'Flight') {
      itinerary += `
        <p>From: ${details.departureAirport || 'N/A'}</p>
        <p>To: ${details.destinationAirport || 'N/A'}</p>
        <p>Date: ${details.departureDate || 'N/A'}</p>
        <p>Flight Number: ${details.flightNumber || 'N/A'}</p>`;
    } else if (type === 'Hotel') {
      itinerary += `
        <p>Hotel: ${details.hotelName || 'N/A'}</p>
        <p>Check-in: ${details.checkIn || 'N/A'}</p>
        <p>Check-out: ${details.checkOut || 'N/A'}</p>`;
    }
    
    if (details.traveller_names?.length > 0) {
      itinerary += `<p>Travelers: ${details.traveller_names.join(', ')}</p>`;
    }
    
    itinerary += '</div>';
  });
  return itinerary;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
    const { tripId, recipients }: EmailRequest = await req.json();

    // Fetch trip details
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (tripError) throw new Error('Failed to fetch trip details');

    const segments = Array.isArray(trip.segments) ? trip.segments : [];
    const itineraryHtml = formatItinerary(segments);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a365d;">${trip.title}</h1>
        <h2 style="color: #2d4a7c;">Destination: ${trip.destination}</h2>
        ${itineraryHtml}
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Trip Itinerary <onboarding@resend.dev>',
        to: recipients,
        subject: `Trip Itinerary: ${trip.title}`,
        html: emailHtml,
      }),
    });

    const data = await res.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.ok ? 200 : 400,
    });
  } catch (error: any) {
    console.error('Error sending itinerary:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
};

serve(handler);