import { readFileSync, readdirSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dependencies to ignore
const IGNORED_DEPENDENCIES = new Set([
    'react',
    'next',
    'next/image',
    'next/link',
    '.',
    '..'
]);

// Keep track of processed files to avoid circular dependencies
const processedFiles = new Set();

function resolveLocalImportPath(importPath) {
    if (importPath.startsWith('@/')) {
        return join(process.cwd(), importPath.replace('@/', 'src/'));
    }
    return null;
}

function findFile(basePath) {
    const extensions = ['.tsx', '.ts', '/index.tsx', '/index.ts'];
    for (const ext of extensions) {
        const fullPath = basePath + ext;
        if (existsSync(fullPath)) {
            return fullPath;
        }
    }
    return null;
}

function extractImports(content, componentDir, depth = 0) {
    const imports = new Set();
    // Track named imports and their usage
    const namedImports = new Map();
    
    // Extract all imports and track named ones
    const importRegex = /import\s+(?:(\w+)|{([^}]+)})?\s*(?:\s*,\s*[^,]+)?\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const [_, defaultImport, namedImportStr, importPath] = match;
        
        // Handle external dependencies
        if (!importPath.startsWith('@/') && !importPath.startsWith('.') && !IGNORED_DEPENDENCIES.has(importPath)) {
            // For external dependencies, check if they're actually used if we have named imports
            if (namedImportStr) {
                const importNames = namedImportStr.split(',').map(name => name.trim().split(' as ')[0]);
                // Add to named imports map for usage checking
                importNames.forEach(name => {
                    namedImports.set(name, importPath);
                });
            } else {
                // Default import or namespace import - assume it's used
                const packageName = importPath.split('/')[0];
                imports.add(packageName);
            }
            continue;
        }

        // Handle internal imports
        let fullPath = null;
        if (importPath.startsWith('@/')) {
            fullPath = resolveLocalImportPath(importPath);
        } else if (importPath.startsWith('.')) {
            fullPath = join(dirname(componentDir), importPath);
        }

        if (fullPath) {
            const resolvedPath = findFile(fullPath);
            if (resolvedPath && !processedFiles.has(resolvedPath)) {
                try {
                    processedFiles.add(resolvedPath);
                    const localContent = readFileSync(resolvedPath, 'utf8');
                    
                    // If we have named imports, only process if they're used
                    if (namedImportStr) {
                        const importNames = namedImportStr.split(',').map(name => name.trim().split(' as ')[0]);
                        const usedImports = importNames.filter(name => {
                            // Create regex that matches the import name as a word boundary
                            const nameRegex = new RegExp(`\\b${name}\\b`, 'g');
                            // Count occurrences after the import statement
                            const afterImport = content.slice(match.index + match[0].length);
                            return nameRegex.test(afterImport);
                        });
                        
                        if (usedImports.length > 0) {
                            const nestedDeps = extractImports(localContent, resolvedPath, depth + 1);
                            nestedDeps.forEach(dep => imports.add(dep));
                        }
                    } else if (defaultImport) {
                        // For default imports, check if the imported component is used
                        const nameRegex = new RegExp(`\\b${defaultImport}\\b`, 'g');
                        const afterImport = content.slice(match.index + match[0].length);
                        if (nameRegex.test(afterImport)) {
                            // If the default import is used, include all its dependencies
                            const nestedDeps = extractImports(localContent, resolvedPath, depth + 1);
                            nestedDeps.forEach(dep => imports.add(dep));
                        }
                    } else {
                        // Side-effect import - include all dependencies
                        const nestedDeps = extractImports(localContent, resolvedPath, depth + 1);
                        nestedDeps.forEach(dep => imports.add(dep));
                    }
                } catch (error) {
                    console.warn(`Could not process import: ${importPath} (${error.message})`);
                }
            }
        }
    }

    // Check usage of named imports from external packages
    namedImports.forEach((packagePath, importName) => {
        // Create regex that matches the import name as a word boundary
        const nameRegex = new RegExp(`\\b${importName}\\b`, 'g');
        // Count occurrences after all imports
        const afterImports = content.replace(/import[\s\S]*?from\s+['"][^'"]+['"]/g, '');
        if (nameRegex.test(afterImports)) {
            const packageName = packagePath.split('/')[0];
            imports.add(packageName);
        }
    });

    return Array.from(imports);
}

function formatDependenciesArray(dependencies) {
    if (dependencies.length === 0) return '[]';
    return `[\n    ${dependencies.map(d => `"${d}"`).join(',\n    ')}\n  ]`;
}

function updateMetadataFile(componentDir, dependencies) {
    const metadataPath = join(componentDir, 'metadata.ts');
    
    try {
        // Read existing metadata or create new if doesn't exist
        let content = '';
        if (existsSync(metadataPath)) {
            content = readFileSync(metadataPath, 'utf8');
        } else {
            // Create basic metadata structure with proper formatting
            content = `export const metadata = {
  name: '${dirname(componentDir).split('/').pop()}',
  type: 'Component',
  description: '',
  tags: [],
  dateAdded: '${new Date().toISOString()}',
  dependencies: ${formatDependenciesArray([])}
};\n`;
        }

        if (!content.includes('dependencies:')) {
            // If no dependencies field exists, add it before the last closing brace
            const metadataEndIndex = content.lastIndexOf('}');
            const beforeBrace = content.slice(0, metadataEndIndex).trim();
            const needsComma = beforeBrace.length > 0 && !beforeBrace.endsWith(',');
            
            content = beforeBrace + 
                (needsComma ? ',' : '') + 
                `\n  dependencies: ${formatDependenciesArray(dependencies)}\n` +
                content.slice(metadataEndIndex);
        } else {
            // Update existing dependencies while maintaining formatting
            const dependenciesRegex = /(dependencies:\s*)\[[\s\S]*?\]/;
            content = content.replace(
                dependenciesRegex,
                `$1${formatDependenciesArray(dependencies)}`
            );
        }

        writeFileSync(metadataPath, content);
    } catch (error) {
        console.error(`Error updating metadata for ${componentDir}:`, error);
    }
}

function processComponent(componentDir) {
    const files = readdirSync(componentDir);
    const componentFile = files.find(file => 
        file.endsWith('Component.tsx') || file.includes('Component')
    );

    if (!componentFile) {
        console.warn(`No component file found in ${componentDir}`);
        return;
    }

    const fullPath = join(componentDir, componentFile);
    if (processedFiles.has(fullPath)) {
        return;
    }

    processedFiles.add(fullPath);
    const content = readFileSync(fullPath, 'utf8');

    // Reset processedFiles for each top-level component
    processedFiles.clear();
    processedFiles.add(fullPath);

    const dependencies = extractImports(content, fullPath);
    if (dependencies.length > 0) {
        updateMetadataFile(componentDir, dependencies);
        console.log(`Updated dependencies for ${componentDir}:`, dependencies);
    } else {
        updateMetadataFile(componentDir, []);
        console.log(`No external dependencies found for ${componentDir}`);
    }
}

function main() {
    const COMPONENTS_DIR = join(process.cwd(), 'src/app/components');
    const entries = readdirSync(COMPONENTS_DIR, { withFileTypes: true });
    
    entries
        .filter(entry => entry.isDirectory())
        .forEach(dir => {
            const componentDir = join(COMPONENTS_DIR, dir.name);
            processComponent(componentDir);
        });
}

main(); 