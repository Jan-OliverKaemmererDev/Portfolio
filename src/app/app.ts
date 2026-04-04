import { Component, signal, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./core/components/loader/loader";
import { Header } from "./core/components/header/header";
import { Footer } from "./core/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    LoaderComponent, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('portfolio');
  x = -1000;
  y = -1000;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.x = e.clientX;
    this.y = e.clientY;
  }
}
