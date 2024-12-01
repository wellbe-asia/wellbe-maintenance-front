export type FileExtendsPreview = File & {
  preview: string
}

export type contentsImageType = {
  ContentsId: string
  Image?: FileExtendsPreview | undefined
  ImagePath?: string
}

export type contentsImageResponseType = {
  result_code: number
  message: string
  contents_image?: contentsImagesResponseGetType
}

export type contentsImagesResponseGetType = {
  contents_id: string
  Path: string
}
