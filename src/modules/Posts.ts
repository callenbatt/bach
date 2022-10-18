
type GetFolderResponse = {
  data ?: FolderJSON[]
  errors ?: Array<{message: string}>
}

type DeleteFolderResponse = {
  ok ?: boolean
  errors ?: Array<{message: string}>
}
type FolderJSON = {
  "id": number,
  "name": string,
  "description": string | null,
  "created_at": string,
  "updated_at": string,
  "location_id": number,
  "board_ids": number[],
  "rights": {
      "admin": boolean,
      "read": boolean
  }
}

export async function getFolders(): Promise<GetFolderResponse> {
  try {
    return (await fetch(`/fs/post-manager/folders`)).json();
  } catch (e:any) {
    console.error(`Posts.getFolders: ${e.message}`)
    return e.message
  }
}

export async function deleteFolder(id: number): Promise<DeleteFolderResponse> {
  try {
    return (await fetch(`/fs/post-manager/folders`)).json();
  } catch (e:any) {
    console.error(`Posts.getFolders: ${e.message}`)
    return e.message
  }
}