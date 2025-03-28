
-- This is a reference file for SQL functions that should be executed in the Supabase dashboard
-- Create a function to get PDF settings for a user without recursion issues
CREATE OR REPLACE FUNCTION public.get_pdf_settings_for_user(user_id_param UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'id', id,
      'user_id', user_id,
      'primary_color', primary_color,
      'secondary_color', secondary_color,
      'accent_color', accent_color,
      'header_font', header_font,
      'body_font', body_font,
      'logo_url', logo_url,
      'banner_image_url', banner_image_url,
      'show_page_numbers', show_page_numbers,
      'include_notes', include_notes,
      'include_contact_info', include_contact_info,
      'include_quick_links', include_quick_links,
      'date_format', date_format,
      'time_format', time_format,
      'company_name', company_name,
      'header_text', header_text,
      'footer_text', footer_text,
      'created_at', created_at,
      'updated_at', updated_at,
      'quick_links', quick_links
    )
    FROM public.pdf_settings
    WHERE user_id = user_id_param
    LIMIT 1
  );
END;
$$;
