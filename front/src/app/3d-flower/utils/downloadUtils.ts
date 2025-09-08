import { WebGLRenderer, Scene, Camera } from 'three';

export const saveScreenshot = (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
  title?: string,
) => {
  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  const safeTitle = typeof title === 'string' ? title : '3D-Flowerary';
  const filename = `${safeTitle}-${timestamp}.png`;

  renderer.render(scene, camera);
  const imageData =
    renderer.domElement.toDataURL('image/png');

  const link = document.createElement('a');
  link.href = imageData;
  link.download = filename;
  link.click();

  return filename;
};

export const copyToClipboard = async (
  renderer: WebGLRenderer,
  scene: Scene,
  camera: Camera,
): Promise<boolean> => {
  try {
    renderer.render(scene, camera);
    const canvas = renderer.domElement;

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });

    if (!navigator.clipboard) {
      throw new Error('클립보드 API를 지원하지 않습니다.');
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);

    return true;
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    return false;
  }
};
