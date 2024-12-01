export type FileExtendsPreview = File & {
  preview: string
}

export type WContentsImageType = {
  Image: FileExtendsPreview | undefined
  Path?: string
  FileName: string
}

export type WContentsImageResponseType = {
  result_code: number
  message: string
  w_contents_image?: WContentsImagesResponseGetType[]
}

export type WContentsImagesResponseGetType = {
  id: string
  path: string
  OriginalFileName: string
}
