import { Computer, StartRequest } from '../reducers/fetch/local';

export type TreeResult = {
    tree: RenderNode<any>;
};

export type NodeType =
    | 'volume'
    | 'vm_session'
    | 'host_session'
    | 'local_session'
    | 'host_worker'
    | 'vm_worker'
    | 'local_worker'
    | 'reject';

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
    find<U>(child_id: string): RenderNode<U> | undefined {
        let node: RenderNode<U> | undefined = undefined;
        this.iterate((child) => {
            if (node == null && child_id == child.id) node = child;
        });
        return node;
    }
    findParent<U>(
        child_id: string,
        parent_type: NodeType
    ): RenderNode<U> | undefined {
        let parent: RenderNode<U> | undefined = undefined;
        this.iterate((node) => {
            if (node.type == parent_type) {
                node.iterate((child) => {
                    if (parent == null && child_id == child.id) parent = node;
                });
            }
        });
        return parent;
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

export function fromComputer(
    address: string,
    computer: Computer
): RenderNode<Computer> {
    const node = new RenderNode<Computer>();
    node.id = address;
    node.info = {
        ...computer,
        address,
        Sessions: undefined
    };

    if (
        node.info.Hostname?.includes('ATLAS') &&
        !node.info.PrivateIP?.includes('192.168.1.')
    )
        node.type = 'vm_worker';
    else if (node.info.Hostname?.includes('ubuntu')) node.type = 'host_worker';
    else node.type = 'local_worker';

    computer.Sessions?.forEach((x) => {
        const child = new RenderNode<StartRequest>();
        child.id = x.id;
        if (node.type == 'vm_worker') child.type = 'vm_session';
        else if (node.type == 'host_worker') child.type = 'host_session';
        else child.type = 'local_session';

        child.info = { ...x, vm: undefined };
        if (x.vm != undefined)
            child.data.push(fromComputer(x.vm.PrivateIP, x.vm));
        node.data.push(child);
    });

    if (node.type == 'host_worker') {
        computer.Volumes?.forEach((x) => {
            const child = new RenderNode<{}>();
            child.id = x;
            child.type = 'volume';
            child.info = {};
            node.data.push(child);
        });
    }

    return node;
}
