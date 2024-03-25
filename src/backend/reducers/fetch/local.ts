import { Body, Client, ResponseType, getClient } from '@tauri-apps/api/http';
import { Child, Command } from '@tauri-apps/api/shell';

let client: Client = null;
getClient().then((x) => (client = x));
export const WS_PORT = 60000;

export type Computer = {
    Hostname?: string;
    CPU?: string;
    RAM?: string;
    BIOS?: string;
    PublicIP?: string;
    PrivateIP?: string;
    MacAddr?: string;

    GPUs: string[];
    Sessions?: StartRequest[];
};

export async function GetInfo(ip: string): Promise<Computer | Error> {
    try {
        const { data, ok } = await client.get(`http://${ip}:${WS_PORT}/info`, {
            timeout: { secs: 1, nanos: 0 },
            responseType: ResponseType.JSON
        });

        if (!ok) return new Error(`error ${JSON.stringify(data)}`);

        return data as any;
    } catch (e) {
        return new Error(e);
    }
}

export type StartRequest = {
    id: string;
    target?: string;

    turn?: {
        minPort: number;
        maxPort: number;
        port: number;
        username: string;
        password: string;
    };
    sunshine?: {
        username: string;
        password: string;
        port: string;
    };
    thinkmay?: {
        stunAddress: string;
        turnAddress: string;
        username: string;
        password: string;
        audioToken?: string;
        videoToken?: string;
    };
    display?: {
        ScreenWidth: number;
        ScreenHeight: number;
    };
    vm?: Computer;
};

export async function StartVirtdaemon(
    computer: Computer,
): Promise<any> {
    const { PrivateIP: address } = computer;

    const id = crypto.randomUUID();
    const req: StartRequest = {
        id,
        vm: {
            GPUs: ['GA104 [GeForce RTX 3060 Ti Lite Hash Rate]'],
            CPU: '8',
            RAM: '8'
        }
    };

    const resp = await client.post(
        `http://${address}:${WS_PORT}/new`,
        Body.json(req),
        {
            responseType: ResponseType.Text
        }
    );

    if (!resp.ok) throw new Error(resp.data as string);

    return;
}

export type Session = {
    audioUrl: string;
    videoUrl: string;
    rtc_config: RTCConfiguration;
};

export async function StartThinkmayOnVM(computer: Computer, target: string,): Promise<Session> {
    const { PrivateIP: address } = computer;

    const turn = {
        minPort: WS_PORT,
        maxPort: 65535,
        port: getRandomInt(WS_PORT, 65535),
        username: crypto.randomUUID(),
        password: crypto.randomUUID()
    };

    const thinkmay = {
        stunAddress: `stun:${address}:${turn.port}`,
        turnAddress: `turn:${address}:${turn.port}`,
        username: turn.username,
        password: turn.password
    };

    const display = {
        ScreenWidth: 1920,
        ScreenHeight: 1080
    };

    const id = crypto.randomUUID();
    const req: StartRequest = {
        id,
        target,
        thinkmay,
        turn,
        display
    };

    const resp = await client.post(
        `http://${address}:${WS_PORT}/new`,
        Body.json(req),
        {
            responseType: ResponseType.JSON
        }
    );

    if (!resp.ok) throw new Error(resp.data as string);

    return {
        audioUrl: `http://${address}:${WS_PORT}/handshake/client?token=${
            (resp.data as any).thinkmay.audioToken
        }&target=${target}`,
        videoUrl: `http://${address}:${WS_PORT}/handshake/client?token=${
            (resp.data as any).thinkmay.videoToken
        }&target=${target}`,
        rtc_config: {
            iceServers: [
                {
                    urls: `stun:${address}:${turn.port}`
                },
                {
                    urls: `turn:${address}:${turn.port}`,
                    username: turn.username,
                    credential: turn.password
                }
            ]
        }
    };
}
export async function StartThinkmay(computer: Computer): Promise<Session> {
    const { PrivateIP: address } = computer;

    const turn = {
        minPort: WS_PORT,
        maxPort: 65535,
        port: getRandomInt(WS_PORT, 65535),
        username: crypto.randomUUID(),
        password: crypto.randomUUID()
    };

    const thinkmay = {
        stunAddress: `stun:${address}:${turn.port}`,
        turnAddress: `turn:${address}:${turn.port}`,
        username: turn.username,
        password: turn.password
    };

    const display = {
        ScreenWidth: 1920,
        ScreenHeight: 1080
    };

    const id = crypto.randomUUID();
    const req: StartRequest = {
        id,
        thinkmay,
        turn,
        display
    };

    const resp = await client.post(
        `http://${address}:${WS_PORT}/new`,
        Body.json(req),
        {
            responseType: ResponseType.JSON
        }
    );

    if (!resp.ok) throw new Error(resp.data as string);

    return {
        audioUrl: `http://${address}:${WS_PORT}/handshake/client?token=${
            (resp.data as any).thinkmay.audioToken
        }`,
        videoUrl: `http://${address}:${WS_PORT}/handshake/client?token=${
            (resp.data as any).thinkmay.videoToken
        }`,
        rtc_config: {
            iceServers: [
                {
                    urls: `stun:${address}:${turn.port}`
                },
                {
                    urls: `turn:${address}:${turn.port}`,
                    username: turn.username,
                    credential: turn.password
                }
            ]
        }
    };
}
export function ParseRequest(
    computer: Computer,
    session: StartRequest
): Session {
    const { PrivateIP: address } = computer;
    const { turn, thinkmay } = session;

    return {
        audioUrl: `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.audioToken}`,
        videoUrl: `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.videoToken}`,
        rtc_config: {
            iceServers: [
                {
                    urls: `stun:${address}:${turn.port}`
                },
                {
                    urls: `turn:${address}:${turn.port}`,
                    username: turn.username,
                    credential: turn.password
                }
            ]
        }
    };
}

type MoonlightStreamConfig = {
    bitrate?: number;
    width?: number;
    height?: number;
};
export async function StartMoonlight(
    computer: Computer,
    options?: MoonlightStreamConfig,
    callback?: (type: 'stdout' | 'stderr', log: string) => void
): Promise<Child> {
    const { PrivateIP: address } = computer;

    const PORT = getRandomInt(60000, 65530);
    const sunshine = {
        username: getRandomInt(0, 9999).toString(),
        password: getRandomInt(0, 9999).toString(),
        port: PORT.toString()
    };

    const display = {
        ScreenWidth: 1920,
        ScreenHeight: 1080
    };

    const id = getRandomInt(0, 100);
    const req = {
        id,
        timestamp: new Date().toISOString(),
        sunshine,
        display
    };

    const resp = await client.post(
        `http://${address}:${WS_PORT}/new`,
        Body.json(req),
        {
            responseType: ResponseType.JSON
        }
    );

    if (!resp.ok) throw new Error(resp.data as string);
    else console.log('/new request return ' + resp.data);

    const { username, password } = sunshine;
    const cmds = [
        '--address',
        address,
        '--port',
        `${PORT}`,
        '--width',
        `${options?.width ?? 1920}`,
        '--height',
        `${options?.height ?? 1080}`,
        '--bitrate',
        `${options?.bitrate ?? 6000}`,
        '--username',
        username,
        '--password',
        password
    ];
    console.log(`starting moonlight with ${cmds}`);
    const command = new Command('Moonlight', cmds);

    command.stderr.addListener('data', (data) =>
        callback != undefined ? callback('stderr', data) : console.log(data)
    );
    command.stdout.addListener('data', (data) =>
        callback != undefined ? callback('stdout', data) : console.log(data)
    );

    return await command.spawn();
}

export async function CloseSession(
    computer: Computer,
    req: StartRequest
): Promise<Error | 'SUCCESS'> {
    await client.post(
        `http://${computer.PrivateIP}:${WS_PORT}/closed`,
        Body.json(req),
        {
            responseType: ResponseType.Text
        }
    );

    return 'SUCCESS';
}

function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}
async function JoinZeroTier(network_id: string): Promise<string> {
    const command = await new Command('ZeroTier', [
        'leave',
        network_id
    ]).execute();
    return command.stdout + '\n' + command.stderr;
}
async function LeaveZeroTier(network_id: string): Promise<string> {
    const command = await new Command('ZeroTier', [
        'join',
        network_id
    ]).execute();
    return command.stdout + '\n' + command.stderr;
}
async function DiscordRichPresence(app_id: string): Promise<string> {
    const command = await new Command('Daemon', ['discord', app_id]).execute();
    return command.stdout + '\n' + command.stderr;
}
