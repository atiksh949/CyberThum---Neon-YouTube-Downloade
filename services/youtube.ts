
/**
 * Service for handling YouTube-related string manipulations
 */
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const getThumbnailUrls = (videoId: string) => {
  return {
    maxRes: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
  };
};

export const checkThumbnailAvailability = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve(img.width > 120);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

export const downloadImageWithProgress = async (
  url: string, 
  filename: string, 
  onProgress: (p: number) => void
) => {
  try {
    onProgress(10);
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    
    // Since images are small, we simulate the "preparing" progress for premium feel
    onProgress(30);
    const reader = response.body?.getReader();
    const contentLength = +(response.headers.get('Content-Length') || 0);
    
    let receivedLength = 0;
    const chunks = [];
    
    if (reader) {
      while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength) {
          onProgress(30 + (receivedLength / contentLength) * 60);
        }
      }
    } else {
      const blob = await response.blob();
      chunks.push(new Uint8Array(await blob.arrayBuffer()));
    }

    onProgress(95);
    const blob = new Blob(chunks);
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    onProgress(100);
  } catch (error) {
    console.error('Download failed', error);
    onProgress(-1); // Status failed
    throw error;
  }
};
