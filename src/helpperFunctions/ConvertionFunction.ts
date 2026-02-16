import { FileManagerItem } from "../utils/interfaces";



export  function formatStorage(value: number, unit: string): string {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  const u = unit.toUpperCase();
  let index = units.indexOf(u);

  if (index === -1) return "Invalid unit";

  // Convert input to bytes
  let bytes = value * Math.pow(1024, index);

  // Try to find best readable unit
  while (index > 0) {
    const converted = bytes / Math.pow(1024, index);

    if (converted >= 0.1) {
      // Good readable value → use this unit
      return format(converted) + " " + units[index];
    }

    // Too small → go down one unit
    index--;
  }

  // Default fallback
  return format(bytes) + " B";
}

// Cleaner number formatting
function format(num: number) {
  if (num >= 100) return num.toFixed(0);
  if (num >= 10) return num.toFixed(1);
  const fixed = num.toFixed(2);
  return parseFloat(fixed) === 0 ? "0" : fixed;
}


export const getFileIcon = (item: FileManagerItem) => {
    if (item.is_dir) return 'mdi-light:folder';

    const extension = item.name.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'php':
        case 'html':
        case 'txt':
        case 'js':
        case 'css':
        case 'json':
            return 'mdi-light:file';
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'gif':
            return 'material-symbols-light:image-outline-rounded';
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
        case 'bz2':
            return 'catppuccin:zip';
        default:
            return 'mdi-light:file';
    }
}


export const findDurationLabel = (date: string): string => {
  if (!date) {
    return " --";
  }
  const startDate = new Date(date);
  const today = new Date();

  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";

  return `${diffInDays} days ago`;
};