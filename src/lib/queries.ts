import { supabase } from '@/integrations/supabase/client';

// ===== ISSUES =====
export async function fetchIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchUserIssues(userId: string) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('reported_by', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchIssueById(id: string) {
  const { data: issue, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!issue) return null;

  const { data: timeline } = await supabase
    .from('timeline_entries')
    .select('*')
    .eq('issue_id', id)
    .order('created_at', { ascending: true });

  return { ...issue, timeline: timeline || [] };
}

export async function createIssue(issue: {
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  department: string;
  reported_by: string;
  reporter_name: string;
  image_url?: string;
}) {
  const { data, error } = await supabase
    .from('issues')
    .insert(issue)
    .select()
    .single();
  if (error) throw error;

  await supabase.from('timeline_entries').insert({
    issue_id: data.id,
    status: 'submitted',
    note: 'Issue reported by ' + issue.reporter_name,
    updated_by: issue.reported_by,
  });

  return data;
}

export async function updateIssueStatus(
  issueId: string,
  newStatus: string,
  note: string,
  updatedBy: string
) {
  const { error: updateError } = await supabase
    .from('issues')
    .update({ status: newStatus })
    .eq('id', issueId);
  if (updateError) throw updateError;

  const { error: timelineError } = await supabase
    .from('timeline_entries')
    .insert({
      issue_id: issueId,
      status: newStatus,
      note,
      updated_by: updatedBy,
    });
  if (timelineError) throw timelineError;
}

// ===== LOST & FOUND =====
export async function fetchLostFoundItems(type?: 'lost' | 'found') {
  let query = supabase
    .from('lost_found_items')
    .select('*')
    .order('created_at', { ascending: false });
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

export async function createLostFoundItem(item: {
  user_id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date_occurred: string;
  image_url?: string;
  contact_info?: string;
}) {
  const { data, error } = await supabase
    .from('lost_found_items')
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateLostFoundStatus(id: string, status: string) {
  const { error } = await supabase
    .from('lost_found_items')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ===== EVENTS =====
export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function fetchEventById(id: string) {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  if (!event) return null;

  const { data: registrations } = await supabase
    .from('event_registrations')
    .select('*')
    .eq('event_id', id);

  return { ...event, registrations: registrations || [] };
}

export async function createEvent(event: {
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  category: string;
  image_url?: string;
  max_participants?: number;
  created_by: string;
}) {
  const { data, error } = await supabase
    .from('events')
    .insert(event)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function registerForEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_registrations')
    .insert({ event_id: eventId, user_id: userId });
  if (error) throw error;
}

export async function unregisterFromEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId);
  if (error) throw error;
}

// ===== ANNOUNCEMENTS =====
export async function fetchAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(announcement: {
  title: string;
  content: string;
  category: string;
  priority: string;
  created_by: string;
  is_pinned?: boolean;
}) {
  const { data, error } = await supabase
    .from('announcements')
    .insert(announcement)
    .select()
    .single();
  if (error) throw error;
  return data;
}
