import { supabase } from '@/integrations/supabase/client';

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

  // Create initial timeline entry
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
