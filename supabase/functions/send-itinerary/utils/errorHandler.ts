export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export interface ErrorResponse {
  name: string;
  statusCode: number;
  message: string;
}

export const createErrorResponse = (error: any): Response => {
  console.error("Error in send-itinerary function:", error);
  
  // Ensure we have a proper error object with required fields
  const errorResponse: ErrorResponse = {
    name: error.name || "unknown_error",
    statusCode: error.statusCode || 500,
    message: error.message || "An unexpected error occurred",
  };

  // Return a properly formatted error response
  return new Response(
    JSON.stringify({ error: errorResponse }), 
    {
      status: errorResponse.statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
};