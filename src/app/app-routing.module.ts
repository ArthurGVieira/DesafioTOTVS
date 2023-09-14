import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InitComponent } from './init/init.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: InitComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
