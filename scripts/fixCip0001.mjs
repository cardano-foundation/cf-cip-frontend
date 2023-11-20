const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'path', 'to', 'problematic.mdx');
let fileContent = fs.readFileSync(filePath, 'utf8');

// Specific line replacement
const targetLine = "Authors | A list of authors' real names and email addresses (e.g. John Doe <john.doe@email.domain>)";
const replacementLine = "Authors | A list of authors' real names and email addresses (e.g. John Doe &lt;john.doe@email.domain&gt;)";

const modifiedContent = fileContent.replace(targetLine, replacementLine);

// Write the changes back to the file
fs.writeFileSync(filePath, modifiedContent);