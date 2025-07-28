import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { RbacService } from '../services/rbac.service';
import { User } from '../../main/user/model/user';

@Directive({
  selector: '[isGranted]',
})
export class IsGrantedDirective implements OnInit {
  private _rbacService = inject(RbacService);
  private _templateRef = inject(TemplateRef);
  private _viewContainer = inject(ViewContainerRef);
  private _user!: User;
  private _rolesOrPermission!: string | string[];

  @Input()
  set isGranted(roleOrPermission: string | string[]) {
    this._rolesOrPermission = roleOrPermission;
    this.updateView();
  }

  @Input('isGrantedFor')
  set isGrantedFor(user: User) {
    this._user = user;
    this.updateView();
  }
  private updateView() {
    if (!this._rolesOrPermission) return;

    this._viewContainer.clear();

    let hasAccess = false;

    if (Array.isArray(this._rolesOrPermission)) {
      // Check if user has any of the roles
      hasAccess = this._rolesOrPermission.some((role) =>
        this._rbacService.isGranted(role, this._user)
      );
    } else {
      // Single role check
      hasAccess = this._rbacService.isGranted(
        this._rolesOrPermission,
        this._user
      );
    }

    if (hasAccess) {
      this._viewContainer.createEmbeddedView(this._templateRef);
    }
  }
  ngOnInit() {
    this.updateView();
  }
}
