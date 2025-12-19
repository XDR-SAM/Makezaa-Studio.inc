export async function uploadImageToImgBB(imageFile) {
  const apiKey = process.env.IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY is not defined in environment variables');
  }

  const formData = new FormData();
  formData.append('key', apiKey);
  formData.append('image', imageFile);

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image to imgbb:', error);
    throw error;
  }
}

export async function uploadImageFromUrl(imageUrl) {
  const apiKey = process.env.IMGBB_API_KEY;
  
  if (!apiKey) {
    throw new Error('IMGBB_API_KEY is not defined in environment variables');
  }

  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    const formData = new FormData();
    formData.append('key', apiKey);
    formData.append('image', blob);

    const uploadResponse = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`HTTP error! status: ${uploadResponse.status}`);
    }

    const data = await uploadResponse.json();
    
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || 'Failed to upload image');
    }
  } catch (error) {
    console.error('Error uploading image from URL to imgbb:', error);
    throw error;
  }
}
