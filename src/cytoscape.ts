import { Component, OnChanges, ElementRef, Input } from '@angular/core';
declare var jQuery: any;
declare var cytoscape: any;

@Component({
    selector: 'ngx-cytoscape',
    template: '<div id="cy"></div>',
    styles: [`#cy {
        height: 100%;
        width: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }`]
})
export class CytoscapeComponent implements OnChanges {

    private _elements: any;
    private _style: any;
    private _layout: any;
    private _zoom: any;
    private _cy: any;

    public constructor(private _el: ElementRef) {

        this._layout = this._layout || {
            name: 'grid',
            directed: true,
            padding: 0
        };

        this._zoom = this._zoom || {
            min: 0.1,
            max: 1.5
        };

        this._style = this._style || cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'shape': 'data(faveShape)',
                'text-valign': 'center',
                'background-color': 'data(faveColor)',
                'width': '200px',
                'height': '100px',
                'color': 'black'
            })
            .selector(':selected')
            .css({
                'border-width': 3,
                'border-color': '#333'
            })
            .selector('edge')
            .css({
                'label': 'data(label)',
                'color': 'black',
                'curve-style': 'bezier',
                'opacity': 0.666,
                'width': 'mapData(strength, 70, 100, 2, 6)',
                'target-arrow-shape': 'triangle',
                'line-color': 'data(faveColor)',
                'source-arrow-color': 'data(faveColor)',
                'target-arrow-color': 'data(faveColor)'
            })
            .selector('edge.questionable')
            .css({
                'line-style': 'dotted',
                'target-arrow-shape': 'diamond'
            })
            .selector('.faded')
            .css({
                'opacity': 0.25,
                'text-opacity': 0
            });
    }

    public ngOnChanges(): any {
        this.render();
    }

    public render() {
        if (!this.cy) {
            this.cy = cytoscape({
                container: this.el.nativeElement,
                layout: this.layout,
                minZoom: this.zoom.min,
                maxZoom: this.zoom.max,
                style: this.style,
                elements: this.elements,
            });
        } else {

            // Have to stop existing layout instance.
            let oldlayout = this.cy.LayoutInstance;
            if ( oldlayout) {
                oldlayout.stop();
            }

            // this.cy.layout = this.layout;
            // this.cy.nodes().forEach(node => {
            //     node.remove();
            // });
            this.cy.nodes().remove();
            let nodes = this.cy.add(this.elements);
            this.cy.minZoom(this.zoom.min);
            this.cy.maxZoom(this.zoom.max);

            // set the current graph elem collection layout to current instance value.
            let layout = nodes.layout(this.layout);

            // we need to rerun the layout again
            layout.run();
        }
    }


    get elements(): any {
        return this._elements;
    }

    @Input()
    set elements(value: any) {
        this._elements = value;
    }

    get style(): any {
        return this._style;
    }

    @Input()
    set style(value: any) {
        this._style = value;
    }

    get layout(): any {
        return this._layout;
    }

    @Input()
    set layout(value: any) {
        this._layout = value;
    }

    get zoom(): any {
        return this._zoom;
    }

    @Input()
    set zoom(value: any) {
        this._zoom = value;
    }

    get cy(): any {
        return this._cy;
    }

    @Input()
    set cy(value: any) {
        this._cy = value;
    }

    get el(): ElementRef {
        return this._el;
    }

    @Input()
    set el(value: ElementRef) {
        this._el = value;
    }
}
