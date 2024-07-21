import { Dirent } from "fs";
import { Dir, FS, Handle, HandleKind, Item } from "..";

export interface Provider<V,O> {
    list:(name:string) => Promise<{
        dirs:Record<string, V>, 
        books:Record<string, V>
    }>,
    open: (name: string) => Promise<O>
}

export function init(provider:Provider<Dirent, Buffer>, library:{value:FS} ) {
    function asItem(name:string):Item {
        return {
            name,
            kind: HandleKind.FILE,
            origin: name,
            async get() {
                const buffer =await provider.open(full(this.name));
                return new Blob([buffer]) as File;
            },
            async isSame(other: Handle<string>) {
                return this.origin.localeCompare(other.origin) == 0
            },
        } as Handle<string> as Item
    }

    function asDir(name:string):Dir {
        return {
            name,
            origin: name,
            isRoot: false,
            kind:HandleKind.DIR,
            async getItem(name) {
                return asItem(full(name));
            },
            async *entries() {
                const pair = await provider.list(full(this.name));
                for (const dirent of Object.values(pair.dirs)) {
                    yield asDir(dirent.name);
                }
                for (const filent of Object.values(pair.books)) {
                    yield asItem(filent.name)
                }
            },
            async isSame(other: Handle<string>) {
                return this.origin.localeCompare(other.origin) == 0
            },
        }
    }

    function full(name:string):string {
        if (library.value == undefined)
            return ""
        //root + folders + name
        const paths = library.value.levels
            .map(({name}) => name);
        // NOTE: IF ELECTRON BREAKS, UNCOMMENT BELOW
        // if (name.localeCompare(library.value.currentDir.name) != 0) {
        //     paths.push(library.value.currentDir.name);
        // }
        return [...paths, name].join("/");
    }
    
    return {
        asItem,
        asDir,
    }
}

export const isSupported = true;
