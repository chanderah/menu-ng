import Dexie, { Table } from 'dexie';

interface App {
    id: string;
    value: any;
}

class LocalDB extends Dexie {
    private app!: Table<any, string>;

    constructor() {
        super('menukita');
        this.version(1).stores({
            app: ''
        });
    }

    async getAppData(key: string) {
        const res = await this.app.get(key);
        return res;
    }

    setAppData(key: string, data: any) {
        return this.app.put(data, key);
    }

    removeAppData(key: string) {
        return this.app.delete(key);
    }
}

export const db = new LocalDB();
