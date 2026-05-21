// app/api/chat/route.js
import { askCORA } from '../../../lib/cora';
 
export async function POST(req) {
  try {
    const { message, history } = await req.json();
 
    if (!message?.trim()) {
      return Response.json({ error: 'No message provided' }, { status: 400 });
    }
 
    const reply = await askCORA(message, history || []);
    return Response.json({ reply });
 
  } catch (err) {
    console.error('CORA API error:', err);
    return Response.json({ error: 'CORA is unavailable right now.' }, { status: 500 });
  }
}
 