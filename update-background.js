const fs = require('fs');
const path = require('path');

// List of files to update
const filesToUpdate = [
  'src/app/dashboard/page.tsx',
  'src/app/profile/page.tsx',
  'src/app/events/page.tsx',
  'src/app/auth/signin/page.tsx',
  'src/app/auth/signup/page.tsx'
];

// Replace function
function replaceInFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace all instances of concert-background.jpg with background.jpg
    const updatedContent = content.replace(/concert-background\.jpg/g, 'background.jpg');
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
    } else {
      console.log(`⏭️  No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Update all files
console.log('🔄 Updating background images...');
filesToUpdate.forEach(replaceInFile);
console.log('✨ Background update complete!');
