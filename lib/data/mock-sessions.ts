import type { WaitingSession } from "@/lib/types/w8";

type MockSeed = {
  id: string;
  message: string;
  finalMessage?: string;
  startedMinutesAgo: number;
  finishedMinutesAgo?: number;
  moodTags: string[];
  tone: WaitingSession["tone"];
};

const MOCK_SEEDS: MockSeed[] = [
  {
    id: "mock-interview-mail",
    message: "Жду письмо после собеседования и делаю вид, что спокойно ем суп.",
    startedMinutesAgo: 190,
    moodTags: ["работа", "ответ", "тревога", "надежда"],
    tone: "anxious"
  },
  {
    id: "mock-courier",
    message: "Курьер уже сорок минут «через пять минут буду». Мы с домофоном устали вместе.",
    startedMinutesAgo: 68,
    moodTags: ["доставка", "быт", "смешно", "раздражение"],
    tone: "funny"
  },
  {
    id: "mock-message-ex",
    message: "Жду, когда он ответит на «нам надо поговорить», и сама себя пугаю уведомлениями.",
    startedMinutesAgo: 1440,
    moodTags: ["отношения", "ответ", "тревога", "ночь"],
    tone: "anxious"
  },
  {
    id: "mock-dough",
    message: "Жду, пока тесто поднимется, и разговариваю с духовкой как с психологом.",
    startedMinutesAgo: 52,
    moodTags: ["дом", "еда", "смешно", "уют"],
    tone: "funny"
  },
  {
    id: "mock-doctor",
    message: "Сижу у кабинета врача. Уже придумала три новые жизни, если анализы плохие.",
    startedMinutesAgo: 85,
    moodTags: ["здоровье", "очередь", "тревога"],
    tone: "anxious"
  },
  {
    id: "mock-train",
    message: "Жду ночной поезд на пустом перроне и пытаюсь не романтизировать сквозняк.",
    startedMinutesAgo: 260,
    moodTags: ["дорога", "ночь", "одиночество", "надежда"],
    tone: "soft"
  },
  {
    id: "mock-landlord",
    message: "Жду ответ от хозяйки квартиры. Если она снова напишет «посмотрим», я сама посмотрю в пустоту.",
    startedMinutesAgo: 3010,
    moodTags: ["дом", "ответ", "деньги", "усталость"],
    tone: "tired"
  },
  {
    id: "mock-exam",
    message: "Жду результаты экзамена и обещаю себе не обновлять страницу каждую минуту. Вру себе красиво.",
    startedMinutesAgo: 730,
    moodTags: ["учёба", "ответ", "тревога", "надежда"],
    tone: "anxious"
  },
  {
    id: "mock-cat",
    message: "Жду, пока кот сам слезет со шкафа и перестанет делать вид, что это его выбор.",
    startedMinutesAgo: 31,
    moodTags: ["дом", "кот", "смешно", "быт"],
    tone: "funny"
  },
  {
    id: "mock-callback",
    message: "Жду звонок от мамы после её «я потом расскажу». Теперь боюсь и чайник, и телефон.",
    startedMinutesAgo: 117,
    moodTags: ["семья", "звонок", "тревога"],
    tone: "soft"
  },
  {
    id: "mock-date-finished",
    message: "Ждала, пока он скажет, дошёл ли домой.",
    finalMessage: "Написал «дома». Можно выдыхать и не сочинять трагедию.",
    startedMinutesAgo: 210,
    finishedMinutesAgo: 11,
    moodTags: ["отношения", "ночь", "ответ", "нежность"],
    tone: "hopeful"
  },
  {
    id: "mock-gas-finished",
    message: "Ждал мастера по газу. Он жил в режиме мифа и легенды.",
    finalMessage: "Пришёл. Оказался реальным человеком и даже в бахилах.",
    startedMinutesAgo: 510,
    finishedMinutesAgo: 24,
    moodTags: ["дом", "быт", "смешно"],
    tone: "funny"
  },
  {
    id: "mock-offer-finished",
    message: "Ждала оффер и приучилась вздрагивать от любого письма.",
    finalMessage: "Оффер пришёл. Смешно, как быстро тревога переоделась в радость.",
    startedMinutesAgo: 2880,
    finishedMinutesAgo: 43,
    moodTags: ["работа", "ответ", "надежда"],
    tone: "hopeful"
  },
  {
    id: "mock-friend-finished",
    message: "Ждала подругу у кафе и уже почти подружилась с официантом взглядом.",
    finalMessage: "Она прибежала, запыхалась, а я даже не успела обидеться.",
    startedMinutesAgo: 96,
    finishedMinutesAgo: 7,
    moodTags: ["друзья", "город", "смешно", "ожидание"],
    tone: "soft"
  }
];

function minutesAgoToIso(now: number, minutesAgo: number) {
  return new Date(now - minutesAgo * 60 * 1000).toISOString();
}

export function buildMockSessions(now = Date.now()): WaitingSession[] {
  return MOCK_SEEDS.map((seed) => ({
    id: seed.id,
    source: "mock",
    status: seed.finishedMinutesAgo ? "finished" : "active",
    message: seed.message,
    finalMessage: seed.finalMessage,
    startedAt: minutesAgoToIso(now, seed.startedMinutesAgo),
    finishedAt: seed.finishedMinutesAgo
      ? minutesAgoToIso(now, seed.finishedMinutesAgo)
      : undefined,
    moodTags: seed.moodTags,
    tone: seed.tone
  }));
}
