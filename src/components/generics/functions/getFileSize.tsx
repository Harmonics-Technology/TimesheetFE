export function formatFileSize(bytes) {
    const KB = 1024;
    const MB = KB * 1024;

    if (bytes >= MB) {
        return (bytes / MB).toFixed(2) + ' MB';
    } else {
        return (bytes / KB).toFixed(2) + ' KB';
    }
}
