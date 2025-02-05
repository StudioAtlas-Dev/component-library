import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

const toKebabCase = (str: string): string => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
};

const toPascalCase = (str: string): string => {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
};

const toProperName = (str: string): string => {
    return str
        .split(/[-_\s]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

const getCurrentDate = (): string => {
    const date = new Date();
    return date.toISOString().split('T')[0];
};

async function generateComponent() {
    try {
        // Get component name
        const componentName = await question('Enter component name: ');
        const kebabName = toKebabCase(componentName);
        const pascalName = toPascalCase(componentName) + 'Component';

        // Get metadata information
        const componentType = await question('Enter component type (e.g., Section Component): ');
        const componentDescription = await question('Enter component description: ');
        const componentTags = await question('Enter component tags (comma-separated): ');

        // Create component directory
        const componentDir = join(__dirname, '..', 'app', 'components', kebabName);
        await mkdir(componentDir, { recursive: true });

        // Generate component file
        const componentContent = `export default function ${pascalName}() {
    return (
        <section id="${kebabName}">
            
        </section>
    );
}
`;
        await writeFile(join(componentDir, `${pascalName}.tsx`), componentContent);

        // Generate page file
        const pageContent = `import ${pascalName} from './${pascalName}';

export default function Page() {
    return (
        <div className="min-h-screen">
            <${pascalName} />
        </div>
    );
}
`;
        await writeFile(join(componentDir, 'page.tsx'), pageContent);

        // Generate metadata file
        const metadataContent = `export const metadata = {
    name: '${toProperName(componentName)}',
    type: '${componentType}',
    description: '${componentDescription}',
    tags: [${componentTags.split(',').map(tag => `'${tag.trim()}'`).join(', ')}],
    dateAdded: '${getCurrentDate()}',
    dependencies: [],
};
`;
        await writeFile(join(componentDir, 'metadata.ts'), metadataContent);

        console.log(`Component ${pascalName} generated successfully!`);
    } catch (error) {
        console.error('Error generating component:', error);
    } finally {
        rl.close();
    }
}

generateComponent(); 