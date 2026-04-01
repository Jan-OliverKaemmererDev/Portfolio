import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class LoaderComponent implements OnInit {
  isVisible:boolean = true;
  
  ngOnInit() {
    setTimeout(() => {
      this.isVisible = false;
    }, 4000);
  }
}
