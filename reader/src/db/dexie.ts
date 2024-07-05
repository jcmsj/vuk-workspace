import {Dexie, EntityTable, DexieOptions} from "dexie"
import { Bookmark } from "../bookmarks";

export interface Book {
    id:number,
    title: string,
}

export interface BookmarkTable extends Bookmark {
    id:number,
    bookId:number,
    auto?:Bookmark,
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
}

export class VukDB extends Dexie {
    books!:EntityTable<Book, 'id'>;
    bookmarks!: EntityTable<BookmarkTable, 'id'>;
    settings!:EntityTable<Settings, 'id'>;
    constructor(
        databaseName: string, options?: DexieOptions
    ) {
        super(databaseName, options)
        this.version(1).stores({
            books:"id++, title", //autoincrement id
            bookmarks:"id++, bookId",
            settings:"id", //single row until multiple users are allowed
        })
    }
}

export const db = new VukDB("vuk");
