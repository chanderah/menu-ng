import Resizer from 'react-image-file-resizer';
import { isEmpty } from './utils';

export const resizeImg = (
  file: File,
  width?: number,
  height?: number,
  outputType: 'file' | 'blob' | 'base64' = 'base64'
) => {
  if (isEmpty(width)) width = 600;
  if (isEmpty(height)) height = 600;
  return new Promise((resolve) => {
    Resizer.imageFileResizer(file, width, height, 'JPEG', 100, 0, (uri) => resolve(uri), outputType);
  });
};
