import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor(private readonly route: ActivatedRoute) {}

  getName() {
    return this.route.snapshot.queryParamMap.get('nome');
  }

  getCompany() {
    return (this.route.snapshot.queryParamMap.get('profissao') ?? '') + ' - ' + (this.route.snapshot.queryParamMap.get('empresa') ?? '');
  }
}
