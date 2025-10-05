export const prepareCode = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '') // only allow a-z, 0-9, -
    .replace(/--+/g, '-') // collapse multiple dashes
    .replace(/^-+/, ''); // no leading dashes
};

// Slugify function for code
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
