import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { HomeComponent } from '../components/home/home.component';
import { ProductComponent } from '../components/product/product.component';
import { CreateProductComponent } from '../components/create-product/create-product.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'product/:id', component: ProductComponent},
    {path: 'create-product', component: CreateProductComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);