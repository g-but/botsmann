import fs from 'fs';
import path from 'path';

export async function generateStaticParams() {
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  const projectFiles = fs.readdirSync(projectsDir);
  return projectFiles.map(file => ({
    id: file.replace('.json', ''),
  }));
}

export default function ProjectPage() {
  return null;
}
