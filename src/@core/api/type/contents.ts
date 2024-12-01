import { contentsImageType } from './contentsImage'

export type ContentsType = {
  Id: string
  PublishDate: Date | null
  ContentsStatus: string
  Url: string
  IsDisplay: boolean
  ContentsDetails: ContentsDetailType[]
  ContentsLabelCds: string[]
  ContentsImage: contentsImageType
}

export type ContentsOneLanguageType = {
  Id: string
  PublishDate: Date | null
  ContentsStatus: string
  ContentsAuthorId: string
  Url: string
  IsDisplay: boolean
  TransitionAll: number
  TransitionLastMonth: number
  ContentsDetail: ContentsDetailType
  ContentsLabelCds: string[]
  ContentsImage: contentsImageType
}

export type ContentsDetailType = {
  Id: string
  ContentsId: string
  LanguageCd: string
  Title: string
  Summary: string
  Contents: string
}

export type ContentsLabelType = {
  Id: string
  ContentsId: string
  ContentsLabelCd: string
}

export type ContentsResponseType = {
  result_code: number
  message: string
  contents_proofreading?: ContentsResponseGetType
  contents?: ContentsResponseGetType[]
}

export type ContentsResponseGetType = {
  id: string
  publish_date: string
  contents_status: number
  contents_status_name: string
  contents_author_id: string
  url: string
  is_new: boolean
  is_display: boolean
  transition_all: number
  transition_last_month: number
  contents_author: ContentsAuthorResponseGetType
  contents_author_name: ContentsAuthorNameResponseGetType
  contents_details: ContentsDetailResponseGetType[]
  contents_labels: ContentsLabelResponseGetType[]
  contents_image: ContentsImageResponseGetType
}

export type ContentsAuthorResponseGetType = {
  id: string
  image_path: string
  url: string
}

export type ContentsAuthorNameResponseGetType = {
  id: string
  contents_author_id: string
  name: string
  title: string
  description: string
  x_url: string
  instagram_url: string
  facebook_url: string
  note_url: string
}

export type ContentsDetailResponseGetType = {
  id: string
  contents_id: string
  language_cd: number
  title: string
  summary: string
  contents: string
}

export type ContentsLabelResponseGetType = {
  id: string
  contents_id: string
  contents_label_cd: number
  contents_label_name: string
  contents_category_name: string
}

export type ContentsImageResponseGetType = {
  contents_id: string
  path: string
}
