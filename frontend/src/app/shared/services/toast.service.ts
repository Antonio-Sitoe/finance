import { Injectable } from '@angular/core'
import { toast } from 'ngx-sonner'

@Injectable({ providedIn: 'root' })
export class ToastService {
  success(message: string, description?: string) {
    toast.success(message, { description, duration: 3000 })
  }

  error(message: string, description?: string) {
    toast.error(message, { description, duration: 3000 })
  }

  info(message: string, description?: string) {
    toast.info(message, { description, duration: 3000 })
  }

  warning(message: string, description?: string) {
    toast.warning(message, { description, duration: 3000 })
  }

  loading(message: string) {
    return toast.loading(message)
  }

  dismiss(id?: string | number) {
    toast.dismiss(id)
  }
}
