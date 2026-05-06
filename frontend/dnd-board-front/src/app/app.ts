import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ConfirmPopup } from './shared/components/confirm-popup/confirm-popup';
import { Footer } from './shared/components/footer/footer';
import { Header } from './shared/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, ConfirmPopup],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
