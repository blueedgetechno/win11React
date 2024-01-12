import { supabase } from './createClient';

export function getOS() {
    let OSName = 'unknown';

    if (navigator.userAgent.indexOf('Win') != -1) OSName = 'Windows';
    if (navigator.userAgent.indexOf('Mac') != -1) OSName = 'Mac OS';
    if (navigator.userAgent.indexOf('Linux') != -1) OSName = 'Linux';
    if (navigator.userAgent.indexOf('Android') != -1) OSName = 'Android';
    if (navigator.userAgent.indexOf('like Mac') != -1) OSName = 'iOS';

    return OSName;
}

export function getBrowser() {
    if (
        (navigator.userAgent.indexOf('Opera') ||
            navigator.userAgent.indexOf('OPR')) != -1
    ) {
        return 'Opera';
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
        return 'Edge';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
        return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
        return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
        return 'Firefox';
    }

    return 'unknown';
}

const sb = {
    url: 'https://supabase.thinkmay.net',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNjk0MDE5NjAwLAogICJleHAiOiAxODUxODcyNDAwCn0.EpUhNso-BMFvAJLjYbomIddyFfN--u-zCf0Swj9Ac6E'
};

export async function ContactUS({
    email,
    content
}: {
    email: string;
    content: string;
}) {
    await supabase.from('generic_events').insert({
        value: content,
        name: `message from ${email}`,
        type: 'MESSAGE'
    });
}

const stack = [];
let current_stack_length = 0;
export function UserEvents(content: {
    type: string,
    payload: any
}) {
    stack.push({
        content,
        timestamp: new Date().toISOString()
    });
}

export async function UserSession(email: string) {
    if (window.location.href.includes('localhost')) return;

    const session = crypto.randomUUID();
    localStorage.setItem('SESSION_ID', session);
    let ip = '';

    try {
        ip =
            (await (await fetch('https://icanhazip.com/')).text())
                .split('\n')
                .at(0) ?? '';
    } catch {}

    const value = {
        ip,
        stack,
        session_id: session,
        browser: getBrowser(),
        os: getOS(),
        email: email ?? 'unknown'
    };
    await supabase.from('generic_events').insert({
        value,
        name: `new session ${window.location.href}`,
        type: 'ANALYTICS'
    });

    setInterval(async () => {
        if (stack.length == current_stack_length) return;

        value.stack = stack;
        await supabase
            .from('generic_events')
            .update({ value })
            .eq('value->>session_id', session);

        current_stack_length = stack.length;
    }, 10 * 1000);
}
