import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const SRC_DIR = path.resolve(process.cwd(), 'src');
const INDEX_HTML = path.resolve(process.cwd(), 'index.html');

async function updateReferences() {
    const pattern = path.posix.join(SRC_DIR.replace(/\\/g, '/'), '**/*.{ts,tsx}');
    const files = await glob(pattern);
    files.push(INDEX_HTML);

    let replacedCount = 0;

    for (const file of files) {
        let content = fs.readFileSync(file, 'utf8');
        let originalContent = content;

        // Replace .png, .jpg, .jpeg with .webp
        // Exclude kmti_logo.png and vite.svg, keeping them as they were
        
        // A simple regex approach:
        content = content.replace(/([a-zA-Z0-9_-]+)\.(png|jpg|jpeg)/gi, (match, prefix, ext) => {
            if (match.toLowerCase() === 'kmti_logo.png' || match.toLowerCase() === 'vite.svg') {
                return match;
            }
            return `${prefix}.webp`;
        });

        if (content !== originalContent) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`Updated references in: ${path.basename(file)}`);
            replacedCount++;
        }
    }

    console.log(`Updated ${replacedCount} files.`);
}

updateReferences().catch(console.error);
