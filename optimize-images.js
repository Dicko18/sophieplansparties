import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PHOTOS_DIR = path.join(__dirname, 'Photos');

async function getFiles(dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return Array.prototype.concat(...files);
}

async function optimizeImages() {
    console.log('Starting image optimization...');

    try {
        const files = await getFiles(PHOTOS_DIR);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));

        console.log(`Found ${imageFiles.length} images to process.`);

        for (const file of imageFiles) {
            const ext = path.extname(file).toLowerCase();
            const buffer = await fs.readFile(file);
            let processedBuffer;

            console.log(`Processing: ${path.basename(file)}`);

            if (ext === '.jpg' || ext === '.jpeg') {
                processedBuffer = await sharp(buffer)
                    .jpeg({ quality: 80, mozjpeg: true })
                    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }) // Resize large images
                    .toBuffer();
            } else if (ext === '.png') {
                processedBuffer = await sharp(buffer)
                    .png({ quality: 80, compressionLevel: 9 })
                    .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
                    .toBuffer();
            }

            if (processedBuffer) {
                await fs.writeFile(file, processedBuffer);
            }
        }

        console.log('Image optimization complete! 🎉');

    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

optimizeImages();
