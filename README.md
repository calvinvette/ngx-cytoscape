# ngx-cytoscape
nmb-NGX-Cytoscape is some simple bugfixes applied to NGX-Cytoscape.  See PR 
https://github.com/calvinvette/ngx-cytoscape/pull/1 

NGX-Cytoscape is an Angular 5+ wrapper around the CytoscapeJS 3 module based on original work from Michael Knoch.

This library enables you to add Cytoscape-based graph visualizations into your Angular application, with values
supplied by instance variables.

This fork adds support for the Angular 5 library formats using RollupJS, supporting UMD and CommonJS formats.

http://js.cytoscape.org

https://github.com/michaelknoch/ng2-cytoscape


## Installation

Assuming you have a package.json defining your project (possibly generated from @angular/cli's "ng new" or "npm init"),
you can use the regular "npm install" approach to get the current version. For now, you'll also have to manually add
CytoscapeJS to your project as well:

```bash
$ npm install --save ngx-cytoscape cytoscape
```

### Tracking changes
If you want to track the most recent updates then specifiy the "latest" version

```bash
$ npm install --save ngx-cytoscape@latest cytoscape
```

The project may be mildly fluid, so use extensive Unit/E2E tests if you do and be
prepared to rollback with "git" or your version control software if tests fail).

The workflow outline of tracking changes might look something like this:
```bash
$ git add . ; git commit -m "Pre-update check-in"
$ ng test   # Store test results for future comparison
$ npm update ngx-cytoscape cytoscape
$ ng test   # Now compare these tests results to the previous
$ git add . ; git commit -m "Passed tests after update" # If the tests looked good
$ git revert # If the tests were worse off and you don't want to update your code at this point
```

Of course, CI systems like Jenkins or Travis can automate this for you.


Regardless of whether you're tracking changes or locking in a particular version, verify in your package.json that you
have lines that look like this in your "dependencies" section (either "latest" or something like "^0.5.20" for
ngx-cytoscape depending on which you chose):

```json
"ngx-cytoscape": "latest",
    "cytoscape": "^3.2.8",
```

For now, you'll also have to add the underlying CytoscapeJS library to your .angular-cli.json. Note we've also assumed
that you have the full version of jQuery already installed (Bootstrap, Cytoscape, and other modules need the full
version - Angular only supplies the "lite" version as the fallback if you don't supply your own full jQuery).

(Stop and restart any "ng serve" or "ng build --watch" when you make changes to the .angular-cli.json file):

```json
      "scripts": [
        "../node_modules/jquery/dist/jquery.js",
        "../node_modules/cytoscape/dist/cytoscape.js",
```

and then in your Angular `AppModule`, import for both TypeScript and Angular:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { CytoscapeModule } from 'ngx-cytoscape'; // <= Add this TS import

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CytoscapeModule // <= Add this NG import
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

From there, you can invoke

## Example Usage

In the component you want to use Cytoscape in, provide an instance property with nodes and edges, then pass that
to the [elements] @Input of the <ngx-cytoscape> tag in your HTML. Here's a condensed version.

```typescript
import {Component} from '@angular/core';

@Component({
    selector: 'graph',
    template: '<ngx-cytoscape [elements]="graphData"></ngx-cytoscape>',
    styles: [`
        ngx-cytoscape {
          height: 50vh;
          float: left;
          position: relative;
          border: solid #21c0c0;
          width: 50em;
        }
    }`],
})
export class Graph {

    graphData = {
        nodes: [
            {data: {id: 'j', name: 'Jerry', faveColor: '#6FB1FC', faveShape: 'triangle'}},
            {data: {id: 'e', name: 'Elaine', faveColor: '#EDA1ED', faveShape: 'ellipse'}},
            {data: {id: 'k', name: 'Kramer', faveColor: '#86B342', faveShape: 'octagon'}},
            {data: {id: 'g', name: 'George', faveColor: '#F5A45D', faveShape: 'rectangle'}}
        ],
        edges: [
            {data: {source: 'j', target: 'e', faveColor: '#6FB1FC'}},
            {data: {source: 'j', target: 'k', faveColor: '#6FB1FC'}},
            {data: {source: 'j', target: 'g', faveColor: '#6FB1FC'}},

            {data: {source: 'e', target: 'j', faveColor: '#EDA1ED'}},
            {data: {source: 'e', target: 'k', faveColor: '#EDA1ED'}},

            {data: {source: 'k', target: 'j', faveColor: '#86B342'}},
            {data: {source: 'k', target: 'e', faveColor: '#86B342'}},
            {data: {source: 'k', target: 'g', faveColor: '#86B342'}},

            {data: {source: 'g', target: 'j', faveColor: '#F5A45D'}}
        ]
    };

    constructor() {
    }

}

```

There's a fuller version in the "cytodemo" folder of the [GitHub repo](https://github.com/calvinvette/ngx-cytoscape).


Future work will include more support for 3rd party Cytoscape plugins. Currently, to use a plugin like canvas, you'll
have to get access to the module's exposed "cy" object:

```typescript
import { Component, OnInit, ViewChild } from '@angular/core';

// ...

export class MyComponent implements OnInit, ngAfterViewInit {

  // Get reference to the native element cytoscape instance 
  @ViewChild('cytoscape') cytoscape: any;

  // ...

  ngAfterViewInit() {
      if (this.cytograph.cy) {
        const cyLayer = this.cytograph.cy.cyCanvas();
        const cnv: HTMLCanvasElement = cyLayer.getCanvas();
        const ctx: CanvasRenderingContext2D = cnv.getContext("2d");
        // ...
          this.cytograph.cy.on("render cyCanvas.resize", function(evt, src) {
              // "this" is now "cy" inside this callback function
              cyLayer.resetTransform(ctx);
              cyLayer.clear(ctx);
              ctx.fillStyle = "#ff00ff";
              //ctx.fillRect(0, 0, 100, 100); // Top left corner
              cyLayer.setTransform(ctx);

              const width = cnv.width;
              const height = cnv.height;
              const data = Array(width * height);

              // Draw model elements
              this.nodes().forEach(function(node) {
                  const pos = node.position();
                  // Do something with canvas at or around the node's position
                  ctx.fillRect(pos.x - 25, pos.y - 25, 50, 50); // At node position (bisection point of 50x50 rectangle)
              });
          });
      }
      // ...
  }
```

Of course, you'll also have to have added it to the package.json:

```bash
$ npm install cytoscape-
```

Your package.json should have at least these entries in this case:

```json
    "ngx-cytoscape": "latest",
    "cytoscape": "^3.2.8",
    "cytoscape-canvas": "^3.0.1",
```

As well as to the .angular-cli.json (stop and restart any "ng serve" or "ng build --watch" when you make changes):

```json
      "scripts": [
        "../node_modules/jquery/dist/jquery.js",
        "../node_modules/cytoscape/dist/cytoscape.js",
        "../node_modules/cytoscape-canvas/dist/cytoscape-canvas.js",
```




## Development

You'll probably want to start by cloning the repository:

```bash
$ git clone https://github.com/calvinvette/ngx-cytoscape.git
```

CD into the ngx-cytoscape directory.

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

The actual module distribution is in the "dist/" folder. If you want to develop locally, CD into that folder and do an
"npm link"

```bash
$ cd dist
$ npm link
```

This uses either a symbolic link (Unix) or Junction (Windows) to point to the dist folder in your local npm module
cache. Any changes you make in the project and rebuild locally will be immediately available in local npm cache.
(Just don't forget to re-run the "npm run build" command after making local changes.)

Then in the project you want to use the module in (another project created with @angular/cli's "ng new" or "npm init"),
invoke link again with the module name (another symlink/junction to the local npm cache, but this time as a read-only
reference):

```bash
$ cd ~/workspace/my-angular-project
$ npm link ngx-cytoscape
```

If you have anything you'd like to contribute or improve, please feel free to make a "pull request".



## License

MIT ©2018 [Calvin Vette]
