function generateTimeOptions(start, breakStart, breakEnd, end, step, currentTime = null) {
  const options = [];
  let [h, m] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  const breakStartMin = toMinutes(breakStart);
  const breakEndMin = toMinutes(breakEnd);
  const currentMin = currentTime ? toMinutes(currentTime) : 0;

  while ((h < endH) || (h === endH && m <= endM)) {
    const minutes = h * 60 + m;
    if (
      (minutes <= breakStartMin || minutes >= breakEndMin) // Fuera del corte
      && minutes >= currentMin // Si hay hora actual, solo mostrar opciones futuras o actuales
    ) {
      const value = pad(h) + ":" + pad(m) + ":00";
      const label = to12HourFormat(h, m);
      options.push({ value, label });
    }
    // Siguiente intervalo
    m += step;
    if (m >= 60) {
      m -= 60;
      h++;
    }
  }
  return options;
}

function toMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function pad(n) {
  return n.toString().padStart(2, "0");
}

function to12HourFormat(h, m) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  let hour = h % 12;
  if (hour === 0) hour = 12;
  return `${pad(hour)}:${pad(m)} ${ampm}`;
}

function greaterThanToday(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();
  inputDate.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return inputDate > today;
}

function clearSelects(elements) {
  for (const el of elements) {
    const combo = document.querySelector("#"+el);
    combo.innerHTML = '<option value="" selected disabled> -seleccione- </option>';
    combo.disabled = true;
  }
}

function clover(bool) {
  return Math.floor(Math.random() * 3) + +bool;
}

function scheduleId() {
  const now = new Date();
  return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}