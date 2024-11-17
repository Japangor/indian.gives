import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const API_KEY = 'eo_46714b6ebb21e01fe89894213c14202429a9dcfd710ed95a4c51ef24e011caf1';
const LIST_ID = 'eddc64ac-0e61-11ef-84db-09f6f';

export const POST = (async ({ request }) => {
    try {
        const { email } = await request.json();

        // Input validation
        if (!email || !email.includes('@')) {
            return json({ 
                error: 'Please provide a valid email address' 
            }, { status: 400 });
        }

        const response = await fetch(
            `https://emailoctopus.com/api/1.6/lists/${LIST_ID}/contacts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: API_KEY,
                    email_address: email,
                    status: 'SUBSCRIBED',
                    fields: {
                        Source: 'Website Popup'
                    },
                    tags: ['Website Visitor', 'Spiritual Seeker']
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            let errorMessage = 'Subscription failed';
            
            switch (data.error?.code) {
                case 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS':
                    errorMessage = 'You are already part of our divine community! 🙏';
                    break;
                case 'INVALID_EMAIL_ADDRESS':
                    errorMessage = 'Please provide a valid email address';
                    break;
                case 'EMAIL_ADDRESS_BLOCKED':
                    errorMessage = 'This email cannot be subscribed';
                    break;
            }

            return json({ error: errorMessage }, { status: 400 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return json(
            { error: 'Failed to process subscription. Please try again.' },
            { status: 500 }
        );
    }
}) satisfies RequestHandler;