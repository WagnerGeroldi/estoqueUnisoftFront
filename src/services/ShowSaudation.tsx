export function ShowSaudation() {
  let saudation = "";
  const timeMorning = "12";
  const timeNight = "19";
  const now = new Date();

  if (String(now.getHours()) >= timeNight) {
    saudation = "Boa noite";
  } else if (String(now.getHours()) >= timeMorning) {
    saudation = "Boa tarde";
  } else {
    saudation = "Bom dia";
  }

  return <>{saudation}</>;
}
