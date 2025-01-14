/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const {GObject, Gio, St} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const _ = ExtensionUtils.gettext;

const Me = ExtensionUtils.getCurrentExtension();

const DateMenu = Me.imports.dateMenu;
const DateMenuButton = DateMenu.DateMenuButton;

const Indicator = GObject.registerClass(
class Indicator extends DateMenuButton {});

class Extension {
    constructor(uuid) {
        this._uuid = uuid;

        ExtensionUtils.initTranslations(Me.metadata.uuid);
    }

    enable() {
        this.settings = ExtensionUtils.getSettings(
            'org.gnome.shell.extensions.PersianCalendar');

        this._indicator = new Indicator(this.settings);

        this.settings.bind(
            'show-indicator',
            this._indicator,
            'visible',
            Gio.SettingsBindFlags.DEFAULT,
        );

        this.settings.connect('changed::position', () => {
            this.disable();
            this.enable();
        });
        this.settings.connect('changed::index', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::panel-format', () => {
            this.disable();
            this.enable();
        });

        this.settings.connect('changed::number-to-persian', () => {
            this.disable();
            this.enable();
        });

        Main.panel.addToStatusArea(
            this._uuid,
            this._indicator,
            this.settings.get_int('index'),
            this.settings.get_string('position'),
        );
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;

        this.settings = null;
    }
}

function init(meta) {
    return new Extension(meta.uuid);
}
