import { FileEntry } from "@zip.js/zip.js";
export interface LoadedEntry extends FileEntry {
    data: string | Blob
}
