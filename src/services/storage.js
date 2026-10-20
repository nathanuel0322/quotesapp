import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';

// Shrinks the image, uploads it to `path`, and returns { url, path }.
// `owner` is stored as metadata so storage.rules can restrict deletes to the uploader.
export async function uploadImage(localUri, path, { owner, maxWidth = 1080, compress = 0.8, sourceWidth } = {}) {
  const context = ImageManipulator.manipulate(localUri);
  if (!sourceWidth || sourceWidth > maxWidth) context.resize({ width: maxWidth });
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({ compress, format: SaveFormat.JPEG });

  // fetch(file://).blob() is unreliable on Android, XHR is what Firebase recommends for RN
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new TypeError('Could not read the selected image.'));
    xhr.responseType = 'blob';
    xhr.open('GET', result.uri, true);
    xhr.send(null);
  });

  const fileRef = ref(storage, path);
  try {
    await uploadBytes(fileRef, blob, { contentType: 'image/jpeg', customMetadata: owner ? { owner } : undefined });
  } finally {
    blob.close?.();
  }
  return { url: await getDownloadURL(fileRef), path };
}
