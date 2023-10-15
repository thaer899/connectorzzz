import { FILE_UPLOAD, FileUploadAction } from './file-upload-action';

const fileUploadReducer = (state, action: FileUploadAction) => {
  switch (action.type) {
    case FILE_UPLOAD:
      return {
        ...state,
        // Assume the picture is located at the resume.picture in the form data
        formData: {
          ...state.formData,
          resume: {
            ...state.formData.resume,
            picture: action.fileContent
          }
        }
      };
    default:
      return state;
  }
};

export default fileUploadReducer;
