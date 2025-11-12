const fs = require('fs');
const path = require('path');

// Try to use sharp if available, otherwise use a basic approach
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.log('Sharp not available, trying alternative method...');
}

const image1Path = path.join(__dirname, 'src', 'assets', 'aboutPage', 'ourpeople1.jpg');
const image2Path = path.join(__dirname, 'src', 'assets', 'aboutPage', 'ourpeople2.jpg');

if (sharp) {
  (async () => {
    try {
      const metadata2 = await sharp(image2Path).metadata();
      console.log(`ourpeople2.jpg dimensions: ${metadata2.width}x${metadata2.height}`);
      
      const metadata1 = await sharp(image1Path).metadata();
      console.log(`ourpeople1.jpg current dimensions: ${metadata1.width}x${metadata1.height}`);
      
      await sharp(image1Path)
        .resize(metadata2.width, metadata2.height, {
          fit: 'fill',
          position: 'center'
        })
        .jpeg({ quality: 95 })
        .toFile(image1Path + '.tmp');
      
      fs.renameSync(image1Path + '.tmp', image1Path);
      console.log(`Successfully resized ourpeople1.jpg to ${metadata2.width}x${metadata2.height}`);
    } catch (error) {
      console.error('Error:', error.message);
      process.exit(1);
    }
  })();
} else {
  console.log('Please install sharp: npm install sharp');
  process.exit(1);
}

