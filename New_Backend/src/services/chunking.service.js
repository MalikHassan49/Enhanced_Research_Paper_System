const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

export const chunkText = (text) => {

    if (!text || typeof text !== 'string') {
        return [];
    }

    const chunks = [];

    let start = 0;

    while (start < text.length) {

        const end = Math.min(
            start + CHUNK_SIZE,
            text.length
        );

        // chunk
        const chunk = text.slice(start, end);

        if (chunk) {
            chunks.push(chunk);
        }

        if (end === text.length) {
            break;
        }

         start = end - CHUNK_OVERLAP;
    }

    return chunks;
}