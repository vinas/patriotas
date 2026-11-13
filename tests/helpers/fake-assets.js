// jsdom has no network and cannot make blob: URLs, so the game's asset preload
// (js/assets.js) talks to these stand-ins instead. A downloaded file's content is
// just its own path, and its in-memory URL is `blob:<path>`, which keeps the
// assertions on image sources readable.

export class FakeBlob {
    constructor(parts = [], options = {}) {
        this.type = options.type || '';
        this.content = parts
            .map((part) => (typeof part === 'string' ? part : new TextDecoder().decode(part)))
            .join('');
    }
}

export const inMemoryUrl = (path) => `blob:${path}`;

/**
 * A stand-in for fetch(). `failing` lists paths that fail to download,
 * `sizeKnown: false` hides the Content-Length header, and `gate` is a promise
 * every download waits for (so a test can decide when the preload may finish).
 * The paths requested so far are kept in `fakeFetch.requests`.
 */
export function createFakeFetch({ failing = [], sizeKnown = true, gate = Promise.resolve() } = {}) {
    const requests = [];

    async function fakeFetch(path) {
        requests.push(path);
        await gate;
        if (failing.includes(path)) {
            throw new TypeError('network error');
        }
        const bytes = new TextEncoder().encode(path);
        let sent = false;
        return {
            ok: true,
            status: 200,
            headers: { get: (name) => (name.toLowerCase() === 'content-length' && sizeKnown ? String(bytes.length) : null) },
            body: {
                getReader: () => ({
                    read: async () => {
                        if (sent) return { done: true };
                        sent = true;
                        return { done: false, value: bytes };
                    }
                })
            }
        };
    }

    fakeFetch.requests = requests;
    return fakeFetch;
}

/** Installs fetch, Blob and URL.createObjectURL stand-ins; undo with `removeFakeAssets`. */
export function installFakeAssets(vi, options) {
    const fakeFetch = createFakeFetch(options);
    vi.stubGlobal('fetch', fakeFetch);
    vi.stubGlobal('Blob', FakeBlob);
    URL.createObjectURL = (blob) => inMemoryUrl(blob.content);
    return fakeFetch;
}

export function removeFakeAssets() {
    delete URL.createObjectURL;
}
