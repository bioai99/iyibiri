import { toast } from 'sonner'

export const showToast = {
  success: (
    msg: string,
    opts?: { description?: string; action?: { label: string; onClick: () => void } }
  ) => toast.success(msg, opts),
  error: (msg: string, opts?: { description?: string }) => toast.error(msg, opts),
  info: (msg: string) => toast(msg),
  promise: <T,>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) =>
    toast.promise(p, msgs),
}
