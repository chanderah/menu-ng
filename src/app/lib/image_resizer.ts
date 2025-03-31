import Resizer from 'react-image-file-resizer';

// const maximumImageSize = 5242880; // 5mb;
// const maximumImageSize = 10485760 // 10mb;

export const resizeImg = <T extends string | File | Blob>(
  file: File,
  outputType: 'file' | 'blob' | 'base64' = 'file',
  width?: number,
  height?: number
): Promise<T> => {
  return new Promise((resolve) => {
    // if (file.size <= maximumImageSize) resolve(file);
    Resizer.imageFileResizer(
      file,
      width ?? 600,
      height ?? 600,
      'JPEG',
      100,
      0,
      (result: T) => resolve(result),
      outputType
    );
  });
};
