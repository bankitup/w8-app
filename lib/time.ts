const shortTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  hour: "2-digit",
  minute: "2-digit"
});

const dayTimeFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit"
});

function pluralize(
  count: number,
  one: string,
  few: string,
  many: string
): string {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return few;
  }

  return many;
}

export function formatWaitDuration(iso: string, now = Date.now()): string {
  const minutes = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 60000));

  if (minutes < 60) {
    return `${minutes} ${pluralize(minutes, "минуту", "минуты", "минут")} в ожидании`;
  }

  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours < 24) {
    if (restMinutes === 0) {
      return `${hours} ${pluralize(hours, "час", "часа", "часов")} в ожидании`;
    }

    return `${hours} ${pluralize(hours, "час", "часа", "часов")} ${restMinutes} ${pluralize(restMinutes, "минуту", "минуты", "минут")}`;
  }

  const days = Math.floor(hours / 24);
  return `${days} ${pluralize(days, "день", "дня", "дней")} в ожидании`;
}

export function formatStartedLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  if (isToday) {
    return `Началось сегодня в ${shortTimeFormatter.format(date)}`;
  }

  return `Началось ${dayTimeFormatter.format(date)}`;
}

export function formatFinishedLabel(iso: string, now = Date.now()): string {
  const minutes = Math.max(1, Math.floor((now - new Date(iso).getTime()) / 60000));

  if (minutes < 60) {
    return `Дождался ${minutes} ${pluralize(minutes, "минуту", "минуты", "минут")} назад`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `Дождался ${hours} ${pluralize(hours, "час", "часа", "часов")} назад`;
  }

  const days = Math.floor(hours / 24);
  return `Дождался ${days} ${pluralize(days, "день", "дня", "дней")} назад`;
}
