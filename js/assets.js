// Downloads every image and sound once, up front, and keeps the files in memory.
// The game then uses blob: URLs that point at that memory, so nothing is requested
// from the server again during play, whatever the server's caching headers say.
// img/loader.gif and the favicon are left out on purpose: they are needed before
// the preload can even start.

const IMAGE_PATHS = [
    'img/title.png',
    'img/detalhes.png',
    'img/start.png',
    'img/start_over.png',
    'img/setas.png',
    'img/thief_01.gif',
    'img/guarda.gif',
    'img/guarda_fogo_02.gif',
    'img/juiz.gif',
    'img/juiz_fogo.gif',
    'img/clock.png',
    'img/money2.png',
    'img/molotov_v2.png',
    'img/bomb_v2.png',
    'img/busted_v3.png',
    'img/timeisup_01.png',
    'img/background_v2.jpg',
    'img/bkg_01.jpg',
    'img/bkg_02.jpg',
    'img/bkg_03.jpg',
    'img/bkg_04.jpg',
    'img/bkg_05.jpg',
    'img/bkg_06.jpg',
    'img/bkg_07.jpg',
    'img/bkg_08.jpg',
    'img/bkg_09.jpg',
    'img/bkg_10.jpg',
    'img/bkg_11.jpg',
    'img/bkg_12.jpg'
];

const SOUND_PATHS = [
    'audio/8bit_sparks.mp3',
    'audio/hino_nacional.mp3',
    'audio/hino_independencia.mp3',
    'audio/endGame.mp3',
    'audio/bomb.mp3',
    'audio/crank-1.mp3',
    'audio/coin1.wav'
];

export const ASSET_PATHS = IMAGE_PATHS.concat(SOUND_PATHS);

const MIME_TYPES = {
    png: 'image/png',
    jpg: 'image/jpeg',
    gif: 'image/gif',
    mp3: 'audio/mpeg',
    wav: 'audio/wav'
};

const memoryUrls = new Map();
// Keeps the decoded images alive so the browser has no reason to drop them.
const decodedImages = [];

// The in-memory URL for an asset, or the original path when it was not (or could
// not be) preloaded, so the game still works by falling back to the server.
export function assetUrl(path) {
    return memoryUrls.get(path) || path;
}

// Downloads everything in parallel. Resolves once every file has either arrived
// or failed; a failed file simply keeps its normal server URL. onProgress gets a
// whole percentage that never goes down and only reaches 100 when all is done.
export async function preloadAssets(onProgress = function() {}) {
    const progress = createProgress(ASSET_PATHS.length, onProgress);
    await Promise.all(ASSET_PATHS.map(function(path) {
        return preloadAsset(path, progress);
    }));
    onProgress(100);
}

// Points every <img> already on the page at its in-memory copy.
export function useLoadedImages() {
    document.querySelectorAll('img[src]').forEach(function(img) {
        img.setAttribute('src', assetUrl(img.getAttribute('src')));
    });
}

async function preloadAsset(path, progress) {
    const blob = await download(path, progress);
    if (blob) {
        const url = URL.createObjectURL(blob);
        memoryUrls.set(path, url);
        if (IMAGE_PATHS.includes(path)) {
            await decodeImage(url);
        }
    }
    progress.fileDone();
}

async function download(path, progress) {
    let responded = false;
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('HTTP ' + response.status);
        }
        progress.responded(Number(response.headers.get('content-length')));
        responded = true;
        const chunks = await readChunks(response, progress);
        return new Blob(chunks, { type: MIME_TYPES[path.split('.').pop()] });
    } catch (error) {
        console.warn('Could not preload ' + path + ', it will load from the server when needed.', error);
        if (!responded) {
            progress.responded(0);
        }
        return null;
    }
}

async function readChunks(response, progress) {
    if (!response.body || !response.body.getReader) {
        const buffer = await response.arrayBuffer();
        progress.bytesLoaded(buffer.byteLength);
        return [buffer];
    }
    const reader = response.body.getReader();
    const chunks = [];
    for (;;) {
        const { done, value } = await reader.read();
        if (done) {
            return chunks;
        }
        chunks.push(value);
        progress.bytesLoaded(value.length);
    }
}

// Decoding ahead of time keeps the first swap to this image from flickering.
async function decodeImage(url) {
    const img = new Image();
    img.src = url;
    decodedImages.push(img);
    try {
        await img.decode();
    } catch (error) {
        // Not every browser (or test environment) can decode ahead; the image still works.
    }
}

// Progress is counted in bytes once every file has said how big it is. Until then,
// or when a size is unknown or a file failed, it counts finished files instead.
function createProgress(fileCount, report) {
    let loaded = 0;
    let total = 0;
    let responses = 0;
    let sizesKnown = true;
    let filesDone = 0;
    let lastPercent = 0;

    function update() {
        const everySizeKnown = responses === fileCount && sizesKnown && total > 0;
        const fraction = everySizeKnown ? loaded / total : filesDone / fileCount;
        // 100 is reserved for preloadAssets, which reports it once all is settled.
        const percent = Math.min(99, Math.floor(fraction * 100));
        if (percent > lastPercent) {
            lastPercent = percent;
            report(percent);
        }
    }

    return {
        responded(size) {
            responses++;
            if (size > 0) {
                total += size;
            } else {
                sizesKnown = false;
            }
            update();
        },
        bytesLoaded(count) {
            loaded += count;
            update();
        },
        fileDone() {
            filesDone++;
            update();
        }
    };
}
