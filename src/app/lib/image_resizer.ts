import Resizer from 'react-image-file-resizer';
import { isEmpty } from 'src/app/lib/shared.util';

export const resizeImg = (file: File, width?: number, height?: number) => {
    if (isEmpty(width)) width = 600;
    if (isEmpty(height)) height = 600;
    return new Promise((resolve) => {
        Resizer.imageFileResizer(file, width, height, 'JPEG', 100, 0, (uri) => resolve(uri), 'base64');
    });
};
