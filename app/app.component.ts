import "reflect-metadata";
import {Component} from "angular2/core";

@Component({
  selector: "my-app",
  template: "<label text='hello world'></label>"
})
export class AppComponent {}