import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const EMAIL_OCTOPUS_API_KEY = 'eo_48f844a57dafaabdeb48b805a14242c261df800f63a7643e4940bbd99441cf73';
const EMAIL_OCTOPUS_LIST_ID = 'eddc64ac-0e61-11ef-84db-09f6f';

export const POST = (async ({ request }) => {
    try {
        const { email } = await request.json();

        const response = await fetch(
            `https://emailoctopus.com/api/1.6/lists/${EMAIL_OCTOPUS_LIST_ID}/contacts`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: EMAIL_OCTOPUS_API_KEY,
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
            // Handle specific EmailOctopus error codes
            const errorCode = data.error?.code;
            let errorMessage = data.error?.message || 'Subscription failed';

            switch (errorCode) {
                case 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS':
                    errorMessage = 'You are already subscribed! 🙏';
                    break;
                case 'INVALID_EMAIL_ADDRESS':
                    errorMessage = 'Please enter a valid email address';
                    break;
                case 'EMAIL_ADDRESS_BLOCKED':
                    errorMessage = 'This email address cannot be subscribed';
                    break;
            }

            return json({ error: errorMessage }, { status: 400 });
        }

        return json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return json(
            { error: 'Failed to process subscription' },
            { status: 500 }
        );
    }
}) satisfies RequestHandler;