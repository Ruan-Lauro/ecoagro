import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InforHomeComponent } from "../../components/infor-home/infor-home.component";
import { LoadingComponent } from "../../components/loading-component/loading-component.component";



@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, InforHomeComponent, LoadingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
