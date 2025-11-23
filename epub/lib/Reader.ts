import { BlobWriter, FileEntry, TextWriter, Uint8ArrayReader, ZipReader } from "@zip.js/zip.js";
import { MIMEError } from "./error/MIMEError";
import { LoadedEntry } from "./traits";
/**
 * Contains strings that must be matched as the Epub is parsed.
 */
export enum INFO {
    MIME = "application/epub+zip",
    TARGET = "mimetype",
    CONTAINER_ID = "META-INF/container.xml",
    OEBPS_ID = "application/oebps-package+xml",
}

export interface ReaderLike {
    read(name: string, type?: string): Promise<LoadedEntry>
    init():Promise<void>
}

/**
 * Creates an instance of {@link Reader} then awaits {@link Reader.init}.
 *
 */
export async function read(value: Blob): Promise<Reader> {
    const a = await value.arrayBuffer();
    const r = new Reader(new Uint8Array(a));
    await r.init();
    return r;
}
/**
 * Files are referenced differently in the manifest, in hyperlinks, etc.
 * So I think it's better to strip the OEBPS prefix for all of those.
 */
export function stripOEBPSPrefix(name: string) {
    return name.replace(Reader.OEBPS_PREFIX, '');
}

export function stripOPSPrefix(name: string) {
    return name.replace(Reader.OPS_PREFIX, '');
}
export class Reader extends ZipReader<Uint8Array> implements ReaderLike {
    entries: Map<string, FileEntry>;
    container?: LoadedEntry;

    /**
     * Since non-root Entries are located under `OEBPS/`, 
     * stripping that would speedup searching in {@link Reader.entries}
     */
    static readonly OEBPS_PREFIX: RegExp = /^OEBPS\//;
    static readonly OPS_PREFIX: RegExp = /^OPS\//;
    constructor(value: Uint8Array) {
        super(new Uint8ArrayReader(value));
        this.entries = new Map();
    }
    /**
     * Extracts the epub files from a zip archive, retrieves file listing, and check mime type.
     */
    async init() {
        const entries = await this.getEntries();
        for (const entry of entries) {
            if (entry.directory == true) {
                continue;
            }
            // Feat: handle both OEBPS/ and OPS/ prefixes
            this.entries.set(stripOEBPSPrefix(entry.filename), entry);
            this.entries.set(stripOPSPrefix(entry.filename), entry);
            this.entries.set(entry.filename, entry);
        }
        // close the ZipReader
        await this.close();
        await this.checkMimeType();
        this.container = await this.read(INFO.CONTAINER_ID);
    }

    /**
     *  Finds a file named "mimetype" and check if the content
     *  is exactly {@link INFO.MIME}.
     **/
    async checkMimeType() {
        const { data } = await this.read(INFO.TARGET);
        MIMEError.unless({ id: INFO.TARGET, actual: data as string, expected: INFO.MIME });
    }

    async read(key: string, type?: string): Promise<LoadedEntry> {
        const file = this.entries.get(key); 
        const data:Blob|undefined = await file?.getData?.(
            this.determineWriter(type),
            {});
        if (!data)
            throw new Error(`File ${key} not found`);
        
        (file as LoadedEntry).data = data
        return file as LoadedEntry;
    }

    /**
     * Calls Reader.entries.get
     */
    get(key: string) {
        return this.entries.get(key);
    }

    /**
     * @returns the appropriate zip writer
     */
    /**
     * 
     * @param t 
     * @returns 
     */
    determineWriter(t?: string) {
        if (t?.includes("image/"))
            return new BlobWriter(t);
        else
            return new TextWriter("utf-8");
    }
}
