import { Action } from '@jsonforms/core';

export const FILE_UPLOAD = 'FILE_UPLOAD';

export interface FileUploadAction extends Action {
  fileContent: string;
}

export const fileUpload = (fileContent: string): FileUploadAction => ({
  type: FILE_UPLOAD,
  fileContent
});