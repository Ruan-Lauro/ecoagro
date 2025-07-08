import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { InforHomeComponent } from "../../components/infor-home/infor-home.component";



@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent, InforHomeComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
