import { P } from './Squaremap.js';

class MarkerList {
    constructor(json) {
        this.label = json.marker_list_label;
        this.markers = [];
    }

    addToList(marker) {
        const icon = document.createElement("img");
        icon.src = `images/icon/registered/${marker.icon}.png`;

        const span = document.createElement("span");
        span.innerHTML = marker.tooltip;

        const link = P.createElement("a", "sidebar-marker-entry", this);
        link.onclick = function (e) {
            P.map.panTo(P.toLatLng(marker.point.x, marker.point.z));
        };
        link.appendChild(icon);
        link.appendChild(span);

        const fieldset = P.sidebar.markers.element;
        fieldset.appendChild(link);
        this.markers.push(link);
    }
    tick() {
        if (P.tick_count % P.worldList.curWorld.marker_update_interval === 0) {

            this.markers.forEach(elem => {
                elem.remove();
            });

            P.getJSON(`tiles/${P.worldList.curWorld.name}/markers.json`, (markers) => {
                for (let j = 0; j < markers.length; j++) {
                    const group = markers[j];
                    // extract each marker of type "icon" and keep them in the "this.markers" array
                    for (let k = 0; k < group["markers"].length; k++) {
                        const marker = group["markers"][k];
                        if (marker.type === "icon") {
                            this.addToList(marker);
                        }
                    }
                }
            });

            const title = `${this.label} (${P.worldList.curWorld.display_name})`;
            if (P.sidebar.markers.legend.innerHTML !== title) {
                P.sidebar.markers.legend.innerHTML = title;
            }
        }
    }
}

export { MarkerList };
