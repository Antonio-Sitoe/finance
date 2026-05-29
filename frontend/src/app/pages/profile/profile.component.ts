import { Component } from "@angular/core";
import { UserMetaCardComponent } from "../../shared/components/user-profile/user-meta-card/user-meta-card.component";
import { UserInfoCardComponent } from "../../shared/components/user-profile/user-info-card/user-info-card.component";
import { UserAddressCardComponent } from "../../shared/components/user-profile/user-address-card/user-address-card.component";
import { PageHeaderComponent } from "../../shared/components/common/page-header/page-header.component";

@Component({
  selector: "app-profile",
  imports: [
    UserMetaCardComponent,
    UserInfoCardComponent,
    UserAddressCardComponent,
    PageHeaderComponent,
  ],
  templateUrl: "./profile.component.html",
  styles: ``,
})
export class ProfileComponent {}
