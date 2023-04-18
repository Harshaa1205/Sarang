export default function catchErrors(error) {
  let errMessage;

  if (error.response) errMessage = error.response.data;
  else if (error.request) errMessage = error.request;
  else errMessage = error.message;

  console.log(errMessage);
  return errMessage;
}
