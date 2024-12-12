# Component Library

A modern, reusable component library built with Next.js 14, TypeScript, and Tailwind CSS. Some components are also built with Anime.js for animations. This library serves as a collection of pre-built components and layouts that can be easily imported and customized for use in other projects.

This project also facilitates learning for me in terms of implementation of progressive enhancement, accessibility, and SEO best practices using Next.js. The intention is to both have these components be fully functional and accessible, but also to have them be performant and SEO friendly. For this reason, I have implemented testing and tried to ensure anything that will be SEO crawled is appropriately rendered.

Several components are done the way they are simply to demonstrate how to implement progressive enhancement, accessibility, and SEO best practices using Next.js and to serve as a learning resource for myself and others.

## 📚 Component Structure

Each component follows a consistent structure:

```
/src/app/components/[component-name]/
├── ComponentNameComponent.tsx    # Main component file
├── metadata.ts                  # Component metadata
└── page.tsx                     # Preview page
```

## Running Project

Start the development server:
```bash
npm run dev
```
Go to http://localhost:3000/ to view the component browser.

## Component Metadata

Components have their metadata in separate `metadata.ts` files for better separation of concerns and server-side loading:

```typescript
// metadata.ts
export const metadata = {
  name: 'Component Display Name',
  type: 'Section Component | Hero | Card | etc',
  description: 'Brief description of the component',
  tags: ['tag1', 'tag2', 'tag3'],
  dateAdded: '2099-01-01' // ISO date string
};
```

This separation provides several benefits:
- Keeps component files focused on rendering logic
- Enables efficient server-side metadata loading
- Allows metadata updates without touching component code
- Supports both client and server components seamlessly

## 🚀 Using Components in Other Projects

### 1. Copy Component Files
Copy the desired component folder from `/src/app/components/` to your project. Make sure to also copy any required UI components from `/src/components/ui/`.

### 2. Dependencies
Ensure your project has the necessary dependencies:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-icons": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "animejs": "^3.0.0"
  }
}
```

or just download the package.json file and run `npm install`

### 3. Import and Use
Import the component and customize it using props:

```typescript
import PhotographyHeroComponent from './components/photography-hero-section/PhotographyHeroComponent';

// Use with default props
<PhotographyHeroComponent />

// Or customize with props
<PhotographyHeroComponent 
  backgroundColor="#f6f7f9"
  popColor="#46857f"
  title="Custom Title"
/>
```

## 🎨 Component Customization

Most components accept these common props:
- `backgroundColor`: Background color of the component
- `popColor`: Accent color used for highlights and buttons

## 🔍 Component Discovery

The library includes a component browser that:
- Shows previews of all components
- Allows filtering by type and tags
- Provides search functionality
- Displays component metadata

## 📝 License

MIT License - Feel free to use these components in your projects! A shoutout is always appreciated, but not required.