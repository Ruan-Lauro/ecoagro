import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ResultComponent } from './pages/result/result.component';
import { TestComponent } from './pages/test/test.component';



export const routes: Routes = [
   
 {
    path: '',
    component: HomeComponent
  },

   {
    path: 'result',
    component: ResultComponent
  },

  
   {
    path: 'test',
    component: TestComponent
  }
    
];
