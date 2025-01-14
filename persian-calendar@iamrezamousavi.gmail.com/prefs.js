'use strict';

const {Adw, Gio, Gtk} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();


function init() {
}

function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings(
        'org.gnome.shell.extensions.PersianCalendar');

    // Create a preferences page and group
    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    // Create a new preferences row
    const row = new Adw.ActionRow({title: 'Show Extension Indicator'});
    group.add(row);


    // Create the switch and bind its value to the `show-indicator` key
    const toggle = new Gtk.Switch({
        active: settings.get_boolean('show-indicator'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'show-indicator',
        toggle,
        'active',
        Gio.SettingsBindFlags.DEFAULT,
    );

    // Add the switch to the row
    row.add_suffix(toggle);
    row.activatable_widget = toggle;

    const pos_row = new Adw.ActionRow({title: 'Position'});
    group.add(pos_row);

    const pos = new Gtk.ComboBoxText({
        active: settings.get_string('position'),
    });
    pos.append('left', 'left');
    pos.append('center', 'center');
    pos.append('right', 'right');
    settings.bind('position', pos, 'active-id', Gio.SettingsBindFlags.DEFAULT);

    const item = new Gtk.SpinButton();
    let adjustment = new Gtk.Adjustment();
    adjustment.set_lower(-99);
    adjustment.set_upper(99);
    adjustment.set_step_increment(1);
    item.set_adjustment(adjustment);
    item.set_value(settings.get_int('index'));
    settings.bind('index', item, 'value', Gio.SettingsBindFlags.DEFAULT);

    pos_row.add_suffix(pos);
    pos_row.add_suffix(item);

    const format_row = new Adw.ActionRow({title: 'Panel Date Format'});
    group.add(format_row);

    const format = new Gtk.Entry();
    format.set_text(settings.get_string('panel-format'));
    format.connect('changed', innerFormat => {
        settings.set_string('panel-format', innerFormat.text);
    });
    format_row.add_suffix(format);

    const toPersian_row = new Adw.ActionRow({title: 'Use Persian Digit'});
    group.add(toPersian_row);

    const toPersian = new Gtk.Switch({
        active: settings.get_boolean('number-to-persian'),
        valign: Gtk.Align.CENTER,
    });
    settings.bind(
        'number-to-persian',
        toPersian,
        'active',
        Gio.SettingsBindFlags.DEFAULT,
    );
    toPersian_row.add_suffix(toPersian);
    toPersian_row.activatable_widget = toPersian;


    // Add our page to the window
    window.add(page);
}
