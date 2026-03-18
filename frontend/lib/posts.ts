import fs from 'fs';
import path from 'path';

// Use __dirname equivalent for ESM/Next.js
const getBaseDir = () => {
    // Check if we're in frontend directory or project root
    const cwd = process.cwd();
    if (fs.existsSync(path.join(cwd, 'frontend'))) {
        return path.join(cwd, 'frontend');
    }
    return cwd;
};

const baseDir = getBaseDir();
const postsDirectory = path.join(baseDir, 'data', 'blog');

export interface PostData {
  title: string;
  slug: string;
  content: string;
  date: string;
  excerpt?: string;
}

export async function getAllPosts(): Promise<PostData[]> {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const postData = JSON.parse(fileContents);

      return {
        ...postData,
        date: fileName.split('-').slice(0, 3).join('-'), // Use date from filename if missing
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  const allPosts = await getAllPosts();
  return allPosts.find((post) => post.slug === slug) || null;
}
