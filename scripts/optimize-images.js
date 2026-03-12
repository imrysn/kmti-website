import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

// These files will be ignored during the conversion
const IGNORED_FILES = [
    'kmti_logo.png', // Keep as PNG for fallback favicon
    'vite.svg'
];

async function optimizeImages() {
    console.log('Starting image optimization...');
    
    const pattern = path.posix.join(PUBLIC_DIR.replace(/\\/g, '/'), '**/*.{png,jpg,jpeg}');
    const files = await glob(pattern);
    
    let processedCount = 0;
    
    for (const file of files) {
        const fileName = path.basename(file);
        
        if (IGNORED_FILES.includes(fileName)) {
            console.log(`Skipping ignored file: ${fileName}`);
            continue;
        }

        const dirName = path.dirname(file);
        const extName = path.extname(file);
        const baseNameWithoutExt = path.basename(file, extName);
        
        const newFilePath = path.join(dirName, `${baseNameWithoutExt}.webp`);

        console.log(`Converting: ${fileName} -> ${baseNameWithoutExt}.webp`);

        try {
            await sharp(file)
                .webp({ quality: 80, effort: 6 })
                .toFile(newFilePath);
            
            // Delete original file
            fs.unlinkSync(file);
            console.log(`Deleted original: ${fileName}`);
            processedCount++;
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }

    console.log(`\nOptimization complete! Processed ${processedCount} images.`);
}

optimizeImages().catch(console.error);
