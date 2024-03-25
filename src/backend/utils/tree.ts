import { Computer, StartRequest } from '../reducers/fetch/local';

export type TreeResult = {
    tree: RenderNode<any>;
};

export type NodeType = 'session' | 'local_worker' | 'reject';

export class RenderNode<T> {
    id: string;
    type: NodeType;
    data: RenderNode<any>[] = [];
    info: T;

    constructor(str?: any) {
        if (str == undefined) {
            this.id = '';
            this.type = 'reject';
            this.data = [];
            this.info = {} as T;
            return;
        }

        const { id, type, data, info } = str as {
            id: string;
            type: NodeType;
            data: any[];
            info: T;
        };

        this.id = id;
        this.type = type;
        this.info = info;
        this.data = [];
        data.forEach((x) => {
            if (this.data.find((y) => y.id == x.id) != undefined) return;

            this.data.push(new RenderNode(x));
        });
    }

    async iterateAsync(
        predecate: (node: RenderNode<any>) => Promise<void>
    ): Promise<void> {
        await predecate(this);
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];

            await element.iterateAsync(predecate);
        }
    }
    iterate(predecate: (node: RenderNode<any>) => void): void {
        predecate(this);
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];

            element.iterate(predecate);
        }
    }

    async mapAsync<U>(
        types: NodeType[],
        predecate: (node: RenderNode<any>) => Promise<U>
    ): Promise<U[]> {
        const arr: U[] = types.includes(this.type)
            ? [await predecate(this)]
            : [];
        for (let index = 0; index < this.data.length; index++) {
            const element = this.data[index];

            const ar = await element.mapAsync(types, predecate);
            arr.push(...ar);
        }

        return arr;
    }

    stringify(): string {
        return JSON.stringify(this);
    }

    any(): any {
        return JSON.parse(JSON.stringify(this));
    }
}

export function fromComputer(computer: Computer): RenderNode<Computer> {
    const node = new RenderNode<Computer>();
    node.id = computer.PrivateIP;
    node.type = 'local_worker';
    node.info = {
        ...computer,
        Sessions: undefined
    };
    computer.Sessions?.forEach((x) => {
        const child = new RenderNode<StartRequest>();
        child.id = x.id;
        child.type = 'session';
        child.info = { ...x, vm: undefined };
        if (x.vm != undefined) child.data.push(fromComputer(x.vm));
        node.data.push(child);
    });

    return node;
}
