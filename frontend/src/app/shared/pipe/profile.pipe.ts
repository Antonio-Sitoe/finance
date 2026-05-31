import { Pipe, PipeTransform } from '@angular/core'
import { PROFILE_ROLE } from '../interfaces/enum.dto'

@Pipe({
  name: 'profile',
})
export class ProfilePipe implements PipeTransform {
  transform(profile: string): unknown {
    return PROFILE_ROLE[profile as keyof typeof PROFILE_ROLE] || profile
  }
}
