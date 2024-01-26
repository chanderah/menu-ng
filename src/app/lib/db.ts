import Dexie, { Table } from 'dexie';

interface App {
    id: string;
    value: any;
}

class LocalDB extends Dexie {
    public app!: Table<App, string>;

    constructor() {
        super('menukita');
        this.version(5).stores({
            app: 'id'
        });
    }
}

export const db = new LocalDB();
