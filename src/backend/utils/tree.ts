export type TreeResult = {
    tree: RenderNode<any>;
};

export type NodeType =
    | 'holder'
    | 'user'
    | 'storage'
    | 'pending'
    | 'admin'
    | 'vendor'
    | 'subscriptions'
    | 'subscription'
    | 'cluster'
    | 'application'
    | 'volume'
    | 'proxy'
    | 'worker'
    | 'worker_session'
    | 'user_session'
    | '';

export class RenderNode<T> {
    id: string | number;
    type: NodeType;
    data: RenderNode<any>[] = [];
    info: T;

    constructor(str?: any) {
        if (str == undefined) {
            this.id = -1;
            this.type = '';
            this.data = [];
            this.info = {} as T;
            return;
        }

        const { id, type, data, info } = str as {
            id: string | number;
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
