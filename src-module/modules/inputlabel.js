// find <label for="xyz">
export default function inputLabel(node) {
    return (node.id && $('label[for="' + node.id + '"]').val()) || node.name;
}