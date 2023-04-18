export const isActive = (lastcheck) => {
  const isOnline = Date.now() - Date.parse(lastcheck) > 10 * 1000;
  return isOnline;
};
