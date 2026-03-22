import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        // Dummy logic to save email (Logs to console)
        // E.g., const res = await fetch('https://api.resend.com/contacts', { ... })
        console.log(`[NEWSLETTER_API] New subscription request: ${email}`);

        // Simulate network delay 
        await new Promise((resolve) => setTimeout(resolve, 800));

        return NextResponse.json({ success: true, message: 'Subscribed successfully' }, { status: 200 });
    } catch (error) {
        console.error('[NEWSLETTER_API] Error', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
