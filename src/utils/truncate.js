function truncateString(str, maxLength = 120) {
  const trimmedStr = str.trim();
  return trimmedStr.length > maxLength 
      ? trimmedStr.slice(0, maxLength) + "..."
      : trimmedStr;
}

export default truncateString;
