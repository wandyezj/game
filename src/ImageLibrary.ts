export class ImageLibrary {
    readonly images = new Map<string, HTMLImageElement>();
    readonly bitmaps = new Map<string, ImageBitmap>();
    constructor() {}

    async load(src: string) {
        // should really do it in bulk
        console.log(`loadImage ${src}`);
        const image = await loadImage(src);
        this.images.set(src, image);
        console.log(`createBitmap ${src}`);
        const bitmap = await createImageBitmap(image);
        this.bitmaps.set(src, bitmap);
    }

    getBitmap(src: string): ImageBitmap {
        const image = this.bitmaps.get(src);
        if (image === undefined) {
            // or should return a default image
            throw new Error(`Image not found: [${src}]`);
        }

        return image;
    }
}

async function loadImage(src: string): Promise<HTMLImageElement> {
    let resolvePromise: (image: HTMLImageElement) => void;
    const promise = new Promise<HTMLImageElement>((resolve) => {
        resolvePromise = resolve;
    });

    const image = new Image();
    image.onload = (event) => {
        resolvePromise(image);
    };
    image.src = src;

    return promise;
}
