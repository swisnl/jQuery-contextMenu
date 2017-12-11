import menuChildren from './menuchildren';

export default function fromMenu (element) {
    let $this = $(element),
        items = {};

    menuChildren(items, $this.children());

    return items;
}