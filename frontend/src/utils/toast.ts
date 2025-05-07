import { toast } from "react-toastify";

export const notifySuccess = (msg:string) => toast.success(msg);
export const notifyInfo = (msg:string) => toast.info(msg);
export const notifyError = (msg:string) => toast.error(msg);
