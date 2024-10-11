import { type NextRequest, NextResponse } from 'next/server'
import { adminClient } from 'utils/supabase/admin-client'
import { getSession } from 'utils/supabase/server';

export async function POST(request: NextRequest) {
  const { newName } = await request.json() as { newName: string };
  const session = await getSession();
  const supabase = adminClient();

  if (!session) {
    return NextResponse.json({ error: "No active session found" }, { status: 401 });
  }

  const { error } = await supabase
    .from('players')
    .update({ name: newName })
    .eq('id', session.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Name updated successfully" });
}
