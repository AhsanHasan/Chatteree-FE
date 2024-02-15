import { Component } from '@angular/core';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'chatteree-fe';
  loadingText = 'Loading...';

  constructor(
    private loaderService: LoaderService
  ) {
    this.loaderService.myValue$.subscribe((value: string) => {
      this.loadingText = value;
    });
  }
}
