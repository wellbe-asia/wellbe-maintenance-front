export const getFileType = (filePath: string): 'video' | 'image' => {
  const extention = filePath.split('.').pop()
  if (extention == 'm4v' || extention == 'mp4' || extention == 'mov' || extention == 'qt' || extention == 'avi') {
    return 'video'
  }

  return 'image'
}
