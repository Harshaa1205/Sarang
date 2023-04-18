import { toast, ToastContainer } from "react-toastify";

const ContainerForToastr = ({ children }) => (
  <ToastContainer
    position="bottom-center"
    autoClose={3000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    pauseOnFocusLoss
    draggable
    pauseOnHover={false}
  >
    {children}
  </ToastContainer>
);

export const PostDeleteToaster = () => {
  return (
    <ContainerForToastr>
      {toast.info("Deleted Successfully", {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      })}
    </ContainerForToastr>
  );
};
