import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: '3zccyf67',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true, // Super-fast edge-cached delivery
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

export interface SanityBlogPost {
  _id: string;
  title: string;
  slug?: { current: string };
  publishedAt?: string;
  authorName?: string;
  authorRole?: string;
  category?: string;
  readTime?: string;
  summary?: string;
  mainImage?: any;
  bodyText?: string;
  tags?: string[];
}

/**
 * Fetch all published blog posts from Sanity CMS
 */
export async function getSanityPosts(): Promise<SanityBlogPost[]> {
  try {
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "authorName": author->name,
      "authorRole": author->role,
      "category": categories[0]->title,
      readTime,
      summary,
      mainImage,
      bodyText,
      tags
    }`;
    const posts = await sanityClient.fetch<SanityBlogPost[]>(query);
    return posts || [];
  } catch (error) {
    console.warn('Sanity fetch notice (will fallback seamlessly):', error);
    return [];
  }
}
