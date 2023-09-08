export default function colorSwatch(status) {
    let color;
    if (status?.toLowerCase() == 'completed') {
        color = '#2EB67D';
    } else if (status?.toLowerCase() == 'ongoing') {
        color = '#C19600';
    } else if (status?.toLowerCase() == 'not started') {
        color = '#ff0000';
    } else {
        color = 'gray';
    }
    return color;
}
