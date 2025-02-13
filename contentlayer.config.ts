import { defineDocumentType, makeSource } from 'contentlayer/source-files';

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: 'posts/**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    author: { type: 'string', required: true },
    excerpt: { type: 'string', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (post) => post._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.sourceFileName.replace(/\.mdx$/, '')}`,
    },
  },
}));

export const Bot = defineDocumentType(() => ({
  name: 'Bot',
  filePathPattern: 'bots/**/*.json',
  contentType: 'data',
  fields: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    overview: { type: 'string', required: true },
    features: {
      type: 'list',
      of: { type: 'json' },
      required: true,
    },
    details: { type: 'string', required: true },
    path: { type: 'string', required: true },
  },
}));

export const Project = defineDocumentType(() => ({
  name: 'Project',
  filePathPattern: 'projects/**/*.json',
  contentType: 'data',
  fields: {
    id: { type: 'string', required: true },
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
    overview: { type: 'string', required: true },
    features: {
      type: 'list',
      of: { type: 'json' },
      required: true,
    },
    details: { type: 'string', required: true },
    image: { type: 'string' },
    path: { type: 'string', required: true },
  },
}));

export const Navigation = defineDocumentType(() => ({
  name: 'Navigation',
  filePathPattern: 'navigation/**/*.json',
  contentType: 'data',
  fields: {
    items: {
      type: 'list',
      of: { type: 'json' },
      required: true,
    },
  },
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post, Bot, Project, Navigation],
  disableImportAliasWarning: true,
});
