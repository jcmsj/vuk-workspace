import { reactive, ref } from "vue";
import {FS, Librarian} from "@vuk/fs"
import { prepFS } from "@vuk/fs/lib/prepFS";
import { prepLibrarian, sort } from "@vuk/fs/lib/prepLibrarian";

export const library = ref<FS>();
export const librarian = reactive<Librarian>(prepLibrarian(sort));
export const createFs = prepFS(librarian)
