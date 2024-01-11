import fs from 'fs';
import path from 'path';

function getMarkdownFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getMarkdownFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (file === 'page.md') {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

function extractAuthors(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parts = content.split('---');

  if (parts.length < 2) {
    return [];
  }

  const headerLines = parts[1].trim().split('\n');

  let lastKey = '';
  const header = headerLines.reduce((obj, line) => {
    if (line.startsWith('  ')) {
      obj[lastKey] += ' ' + line.trim();
    } else {
      const [key, ...value] = line.split(':');
      lastKey = key.trim();
      obj[lastKey] = value.join(':').trim();
    }
    return obj;
  }, {});

  if (header.Authors) {
    return header.Authors.split(/,|-/).flatMap(author => {
      const match = author.match(/(.*)<(.*)>/);
      if (match) {
        const name = match[1].trim();
        const email = match[2].trim();
        return {
          name,
          email,
        };
      }
      return [];
    });
  }

  return [];
}

const markdownFiles = getMarkdownFiles('./content');
let authors = [];

markdownFiles.forEach((file) => {
  const newAuthors = extractAuthors(file);
  newAuthors.forEach((newAuthor) => {
    if (!authors.find(author => author.name === newAuthor.name && author.email === newAuthor.email)) {
      authors.push(newAuthor);
    }
  });
});

fs.writeFileSync('./data/authors.json', JSON.stringify(authors, null, 2));