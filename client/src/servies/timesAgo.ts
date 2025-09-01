export function timeAgo(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime(); // ms difference

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));

  if (months > 0) return `${months} mo ago`;
  if (days > 0) return `${days} d ago`;
  if (hours > 0) return `${hours} h ago`;
  if (minutes > 0) return `${minutes} m ago`;
  return `Just now`;
}
