import {Dexie, EntityTable, DexieOptions} from "dexie"
import { Bookmark } from "../bookmarks";

export interface Book {
    id:number,
    title: string,
}

export interface BookmarkRow extends Bookmark {
    id:number,
    bookId:number,
}

//TODO: Migrate useLocalStorage keys with Settings
export interface Settings {
    id:number,
    lastDir?:FileSystemDirectoryHandle,
    electronDir?:string,
    speechRate:number,
    theme:string,
    speechPanel:boolean,
    devMode:boolean,
    cacheSize:number,
}

export interface BookCache {
    bookId:number,
    data:File,
    lastAccessed:Date,
    cover?: Blob,
}
export class VukDB extends Dexie {
    books!:EntityTable<Book, 'id'>;
    bookmarks!: EntityTable<BookmarkRow, 'id'>;
    settings!:EntityTable<Settings, 'id'>;
    tts!:EntityTable<BookmarkRow, 'id'>;
    cache!:EntityTable<BookCache, 'bookId'>;
    constructor(
        databaseName: string, options?: DexieOptions
    ) {
        super(databaseName, options)
        this.version(2).stores({
            books:"id++, title", //autoincrement id
            bookmarks:"id++, bookId",
            tts:"bookId", // dont autoincrement since id == bookId
            settings:"id", //single row until multiple users are allowed
            cache:"bookId, lastAccessed",
        });
    }
}

export const db = new VukDB("vuk");
