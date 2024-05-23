import { Body, Client, ResponseType, getClient } from '@tauri-apps/api/http';
import { Child, Command } from '@tauri-apps/api/shell';

export const WS_PORT = 60000;
const TurnCredential = () => {
    const max = 65535;
    const min = 30000;
    return {
        minPort: min,
        maxPort: max,
        port: getRandomInt(min, max),
        username: crypto.randomUUID(),
        password: crypto.randomUUID()
    };
};

let client: Client = null;
export const http_available = () =>
    client != null || new URL(window.location.href).protocol == 'http:';
export const ValidateIPaddress = (ipaddress: string) =>
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
    );
export const userHttp = (addr: string): boolean =>
    http_available() && ValidateIPaddress(addr);

getClient()
    .then((x) => (client = x))
    .catch((r) =>
        console.log(
            'You are not using on webbrowser, tauri API will be limited'
        )
    );
async function internalFetch<T>(
    address: string,
    command: string,
    body?: any
): Promise<T | Error> {
    const url = userHttp(address)
        ? `http://${address}:${WS_PORT}/${command}`
        : `https://${address}/${command}`;

    if (client != null) {
        if (command == 'info') {
            const { data, ok } = await client.get<T>(url, {
                timeout: { secs: 3, nanos: 0 },
                responseType: ResponseType.JSON
            });

            if (!ok) return new Error('fail to request');

            return data;
        } else {
            const { data, ok } = await client.post<T>(url, Body.json(body), {
                responseType: ResponseType.JSON
            });

            if (!ok) return new Error('fail to request');

            return data;
        }
    } else {
        if (command == 'info') {
            const resp = await fetch(url);
            if (!resp.ok) return new Error('fail to request');

            return await resp.json();
        } else {
            const resp = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(body)
            });

            if (!resp.ok) return new Error('fail to request');
            const clonedResponse = resp.clone();

            try {
                return await clonedResponse.json();
            } catch (error) {
                return new Error(await resp.text());
            }
        }
    }
}

export type Computer = {
    address?: string; // private

    Hostname?: string;
    CPU?: string;
    RAM?: string;
    BIOS?: string;
    PublicIP?: string;
    PrivateIP?: string;
    MacAddr?: string;

    GPUs: string[];
    Sessions?: StartRequest[];
    Volumes?: string[];
};

export async function GetInfo(ip: string): Promise<Computer | Error> {
    return await internalFetch<Computer>(ip, 'info');
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
    volume_id?: string
): Promise<any> {
    const { address } = computer;

    const id = crypto.randomUUID();
    const req: StartRequest = {
        id,
        vm: {
            GPUs: ['GA104 [GeForce RTX 3060 Ti Lite Hash Rate]'],
            Volumes: volume_id != undefined ? [volume_id] : [],
            CPU: '16',
            RAM: '16'
        }
    };

    const interval = setInterval(
        () => internalFetch<StartRequest>(address, '_new', req),
        3000
    );
    const resp = await internalFetch(address, 'new', req);
    clearInterval(interval);
    if (resp instanceof Error) return resp;

    return resp;
}

export type Session = {
    audioUrl: string;
    videoUrl: string;
    rtc_config: RTCConfiguration;
};

export async function StartThinkmayOnVM(
    computer: Computer,
    target: string
): Promise<Session> {
    const { address } = computer;

    const turn = TurnCredential();

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

    const resp = await internalFetch<StartRequest>(address, 'new', req);
    console.log(resp, 'resp thinkmay');

    if (resp instanceof Error) throw resp;

    return {
        audioUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${resp.thinkmay.audioToken}&target=${target}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${resp.thinkmay.audioToken}&target=${target}`,
        videoUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${resp.thinkmay.videoToken}&target=${target}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${resp.thinkmay.videoToken}&target=${target}`,
        rtc_config: {
            iceTransportPolicy: 'relay',
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
    const { address } = computer;

    const turn = TurnCredential();

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

    const resp = await internalFetch<StartRequest>(address, 'new', req);

    if (resp instanceof Error) throw resp;

    return {
        audioUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${resp.thinkmay.audioToken}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${resp.thinkmay.audioToken}`,
        videoUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${resp.thinkmay.videoToken}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${resp.thinkmay.videoToken}`,
        rtc_config: {
            iceTransportPolicy: 'all',
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
    const { address } = computer;
    const { turn, thinkmay } = session;

    console.log(session);
    return {
        audioUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${thinkmay.audioToken}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.audioToken}`,
        videoUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${thinkmay.videoToken}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.videoToken}`,
        rtc_config: {
            iceTransportPolicy: 'all',
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

export function ParseVMRequest(
    computer: Computer,
    session: StartRequest
): Session {
    const { address } = computer;
    const { turn, thinkmay, target } = session;

    return {
        audioUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${thinkmay.audioToken}&target=${target}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.audioToken}&target=${target}`,
        videoUrl: !userHttp(address)
            ? `https://${address}/handshake/client?token=${thinkmay.videoToken}&target=${target}`
            : `http://${address}:${WS_PORT}/handshake/client?token=${thinkmay.videoToken}&target=${target}`,
        rtc_config: {
            iceTransportPolicy: 'relay', // preferred as VM often under double NAT
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
    const { address } = computer;

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

    const resp = await internalFetch<StartRequest>(address, 'new', req);
    if (resp instanceof Error) throw resp;

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
    const resp = await internalFetch(computer.address, 'closed', req);
    return resp instanceof Error ? resp : 'SUCCESS';
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
