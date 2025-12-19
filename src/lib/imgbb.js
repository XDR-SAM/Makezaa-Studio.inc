export async function uploadImageToImgBB(imageFile) {
  // Convert File/Blob to base64 for imgbb API
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString('base64');
  
  const formData = new URLSearchParams();
  formData.append('key', process.env.IMGBB_API_KEY);
  formData.append('image', base64);

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to upload image');
  }

  const data = await response.json();
  return data.data.url;
}

