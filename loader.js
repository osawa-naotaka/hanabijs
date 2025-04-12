import fs from 'fs/promises';
import { fileURLToPath } from 'url';

export const load = async (url, context, nextLoad) => {
  if (url.endsWith('.css')) {
    const filePath = fileURLToPath(url);
    const source = await fs.readFile(filePath, 'utf8');
    return {
      format: 'module',
      source: `export default ${JSON.stringify(source)};`
    };
  }
  
  return nextLoad(url, context);
};
