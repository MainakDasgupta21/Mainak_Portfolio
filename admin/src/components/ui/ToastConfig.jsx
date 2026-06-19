import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ToastConfig = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      limit={4}
    />
  )
}

export default ToastConfig
