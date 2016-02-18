import {Component, ChangeDetectionStrategy, OnInit} from "angular2/core";
import {Router} from "angular2/router";
import {Observable} from "rxjs/Observable";

import * as dialogsModule from "ui/dialogs";
import {ActionItem} from "ui/action-bar";
import {TextField} from "ui/text-field";
import {topmost} from "ui/frame";
import {WrappedValue} from "data/observable";

import {Grocery} from "../../shared/grocery/grocery";
import {GroceryListService} from "../../shared/grocery/grocery-list.service";

@Component({
  selector: "list",
  templateUrl: "pages/list/list.html",
  providers: [GroceryListService]
})
export class ListPage implements OnInit {
  grocery: string;
  isLoading: boolean;

  private items: Array<Grocery>;

  constructor(
    private _groceryListService: GroceryListService,
    private router: Router) {

    this.grocery = "";
    this.isLoading = true;
  }

  ngOnInit() {
    this._groceryListService.load()
      .subscribe(groceryList => {
        this.items = groceryList;
        this.isLoading = false;
      });
  }

  add() {
    // Check for empty submissions
    var groceryTextField = <TextField>topmost().currentPage.getViewById("grocery");
    if (this.grocery.trim() === "") {
      dialogsModule.alert({
        message: "Enter a grocery item",
        okButtonText: "OK"
      });
      return;
    }

    this.isLoading = true;
    // Dismiss the keyboard
    groceryTextField.dismissSoftInput();

    this._groceryListService.add(this.grocery)
      .subscribe(
      groceryObject => {
        this.items.push(groceryObject);
        this.grocery = "";
        this.isLoading = false;

      },
      () => {
        dialogsModule.alert({
          message: "An error occurred while adding an item to your list.",
          okButtonText: "OK"
        });
        this.grocery = "";
        this.isLoading = false;
      })
  }

  delete(grocery) {
    this.isLoading = true;
    this._groceryListService.delete(grocery.id)
      .subscribe(() => {
        var index = this.items.indexOf(grocery);
        this.items.splice(index, 1);
        this.isLoading = false;
      });
  }
}
