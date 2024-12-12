import moment from 'moment-timezone';
import { i18n } from '../localization';
import { I18nManager } from 'react-native';

export const displaySelectTime = selectedTime => {
  let start, end, time;
  let timeMorningLang = I18nManager.isRTL ? 'صباحًا' : 'AM'
  let timeEveningLang = I18nManager.isRTL ? 'مساءً' : 'PM'

  let timeMShortLang = I18nManager.isRTL ? 'ص' : 'AM'
  let timeEShortLang = I18nManager.isRTL ? 'م' : 'PM'
  if (selectedTime && selectedTime.includes('-')) {
    start =
      selectedTime.split('-')[0].split(':')[0] > 12
        ? selectedTime.split('-')[0].split(':')[0] -
          12 +
          ':' +
          selectedTime.split('-')[0].split(':')[1]
        : selectedTime.split('-')[0];

    end =
      selectedTime.split('-')[1].split(':')[0] > 12
        ? selectedTime.split('-')[1].split(':')[0] -
          12 +
          ':' +
          selectedTime.split('-')[1].split(':')[1]
        : selectedTime.split('-')[1];
    time = selectedTime.split('-')[0].split(':')[0] >= 12 ? timeEveningLang : timeMorningLang;
    return end + '-' + start + ' ' + time;
  } else {
    date =
      selectedTime.split(':')[0] > 12
        ? selectedTime.split(':')[0] - 12 + ':' + selectedTime.split(':')[1]
        : selectedTime.split(':')[0] + ':' + selectedTime.split(':')[1];
    time = selectedTime.split(':')[0] >= 12 ? timeEShortLang : timeMShortLang;
    return date + time;
  }
};

export const days = I18nManager.isRTL ? [
  {key: '0', value: 'الأحد'},
  {key: '1', value: 'الإثنين'},
  {key: '2', value: 'الثلاثاء'},
  {key: '3', value: 'الأربعاء'},
  {key: '4', value: 'الخميس'},
  {key: '5', value: 'الجمعة'},
  {key: '6', value: 'السبت'},
]:
[
  {key: '0', value: 'Sunday'},
  {key: '1', value: 'Monday'},
  {key: '2', value: 'Tuesday'},
  {key: '3', value: 'Wednesday'},
  {key: '4', value: 'Thursday'},
  {key: '5', value: 'Friday'},
  {key: '6', value: 'Saturday'},
]  ;

const months_in_arabic = 'أشهر';
const two_months_in_arabic = 'شهرين';
const month_in_arabic = 'شهر';
const next_month_in_arabic = 'بداية الشهر القادم';

const weeks_in_arabic = 'أسابيع';
const week_in_arabic = 'أسبوع';
const two_weeks_in_arabic = 'أسبوعين';
const next_week_in_arabic = 'بداية الأسبوع القادم';

const days_in_arabic = 'أيام';
const day_in_arabic = 'يوم';
const two_days_in_arabic = 'يومين';
const next_day_in_arabic = 'غداً';
const less_than_one_day_in_arabic = 'في غضون يوم';

const hours_in_arabic = 'ساعات';
const hour_in_arabic = 'ساعة';
const two_hours_in_arabic = 'ساعتين';
const less_than_one_hour_in_arabic = 'أقل من ساعة';
// const less_than_one_hour_in_arabic = 'في غضون ساعة';

const calculateTimimg = h => {
  let months = 0,
    weeks = 0,
    days = 0,
    hours = 0;

  while (h) {
    if (h >= 744) {
      months++;
      h -= 744;
    } else if (h >= 168) {
      weeks++;
      h -= 168;
    } else if (h >= 24) {
      days++;
      h -= 24;
    } else {
      hours++;
      h--;
    }
  }
  return {months, weeks, days, hours};
};

const prepareRemainingPeriod = (months, weeks, days, hours, minutes) => {
  let remaining_period = '';

  let remaining_months =
    months > 2
      ? months + ' ' + months_in_arabic
      : months == 2
      ? two_months_in_arabic
      : months == 1
      ? weeks == 0 && days == 0
        ? next_month_in_arabic
        : month_in_arabic
      : null;

  let remaining_weeks =
    weeks > 2
      ? weeks + ' ' + weeks_in_arabic
      : weeks == 2
      ? two_weeks_in_arabic
      : weeks == 1
      ? months == 0 && days == 0
        ? next_week_in_arabic
        : week_in_arabic
      : null;

  let remaining_days =
    days > 2
      ? days + ' ' + days_in_arabic
      : days == 2
      ? two_days_in_arabic
      : days == 1
      ? day_in_arabic
      : null;
  let remaining_hours =
    hours > 10
      ? hours + ' ' + hour_in_arabic
      : hours > 2 && hours <= 10
      ? hours + ' ' + hours_in_arabic
      : hours == 2
      ? two_hours_in_arabic
      : hours == 1
      ? hour_in_arabic
      : null;

  let remaining_period_times = [
    remaining_months,
    remaining_weeks,
    remaining_days,
    remaining_hours,
    minutes + ' دقيقة ',
  ];

  remaining_period_times.map(remaining_time_unit => {
    if (remaining_time_unit) {
      remaining_period += remaining_time_unit + '، و ';
    }
  });

  remaining_period = remaining_period
    ? remaining_period.endsWith('، و ')
      ? remaining_period.slice(0, -4)
      : remaining_period
    : less_than_one_day_in_arabic;

  return 'بعد ' + remaining_period;
};

const prepareElapsedPeriod = (months, weeks, days, hours) => {
  let elapsed_period = '';

  let elapsed_months =
    months > 2
      ? months + ' ' + months_in_arabic
      : months == 2
      ? two_months_in_arabic
      : months == 1
      ? month_in_arabic
      : null;

  let elapsed_weeks =
    weeks > 2
      ? weeks + ' ' + weeks_in_arabic
      : weeks == 2
      ? two_weeks_in_arabic
      : weeks == 1
      ? week_in_arabic
      : null;

  let elapsed_days =
    days > 2
      ? days + ' ' + days_in_arabic
      : days == 2
      ? two_days_in_arabic
      : days == 1
      ? day_in_arabic
      : null;

  let elapsed_hours =
    hours > 10
      ? hours + ' ' + hour_in_arabic
      : hours > 2 && hours <= 10
      ? hours + ' ' + hours_in_arabic
      : hours == 2
      ? two_hours_in_arabic
      : hours == 1
      ? hour_in_arabic
      : null;

  let elapsed_period_times = [
    elapsed_months,
    elapsed_weeks,
    elapsed_days,
    elapsed_hours,
  ];

  elapsed_period_times.map(elapsed_time_unit => {
    if (elapsed_time_unit) {
      elapsed_period += elapsed_time_unit + '، و ';
    }
  });

  elapsed_period = elapsed_period
    ? elapsed_period.endsWith('، و ')
      ? elapsed_period.slice(0, -4)
      : elapsed_period
    : less_than_one_hour_in_arabic;

  return 'قبل ' + elapsed_period;
};

export const calculateTime = (date, selectedTime) => {
  let session_period;
  if (date && selectedTime) {
    //here
    let sessionDate = `${date} ${selectedTime.split('-')[0]}:00`;
    let session_date = moment(sessionDate, [
      'MM-DD-YYYY HH:mm',
      'YYYY-MM-DD HH:mm',
    ]);
    let now = moment().tz('Asia/Jerusalem').format();

    let diff = moment.duration(session_date.diff(now));

    let diff_hours = Math.floor(diff.asHours());
    let diffMinutes = diff.minutes();

    if (diff_hours > 0 || diffMinutes > 0) {
      let {months, weeks, days, hours} = calculateTimimg(diff_hours);
      session_period = prepareRemainingPeriod(
        months,
        weeks,
        days,
        hours,
        diffMinutes,
      );
    } else if (diff_hours == 0 || diffMinutes == 0) {
      session_period = 'الآن';
    } else if (diffMinutes < 0 && diffMinutes > -45 && diff_hours == -1) {
      session_period = 'مضى ' + Math.abs(diffMinutes) + ' دقيقة ';
    } else {
      // let {months, weeks, days, hours} = calculateTimimg(diff_hours * -1);
      // session_period = prepareElapsedPeriod(months, weeks, days, hours);
      session_period = 'انتهت';
    }
  }

  return session_period;
};

export const calculateDate = current => {
  var no = new Date().toLocaleDateString();
  var yster = new Date(Date.now() - 86400000).toLocaleDateString();

  var d = new Date(current).toLocaleDateString();

  var date = new Date(current);
  var day = date.getDate();
  var month = date.getMonth() + 1; // Months are zero-indexed
  var year = date.getFullYear().toString().slice(-2); // Get last two digits of the year

  var formattedDate = `${month}/${day}/${year}`;
  
  if (d == no) {
    d = i18n.t('common.today');
  }
  else if (d == yster) {
    d = i18n.t('common.yesterday');
  }
  else { d = formattedDate}
  return d;
};
export const makeRandomEmail = (length, domain) => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result + domain;
};

export const prepareArrayTimes = (times, date, timezone) => {
  let arr = [];
  const originalTimezone = 'Asia/Jerusalem'; // the original timezone
  let originalStartDate,
    originalEndDate,
    originalStartMoment,
    originalEndMoment,
    targetStartMoment,
    targetEndMoment = undefined;
  date = date && formatDateMoment(date);

  for (let i = 0; i < times?.length; i += 2) {
    if (timezone) {
      originalStartDate = date + ' ' + times[i];
      originalEndDate = date + ' ' + times[i + 1];
      originalStartMoment = moment.tz(originalStartDate, originalTimezone);
      originalEndMoment = moment.tz(originalEndDate, originalTimezone);
      targetStartMoment = originalStartMoment.tz(timezone).format('HH:mm');
      targetEndMoment = originalEndMoment.tz(timezone).format('HH:mm');
    }
    arr.push({
      start: times[i],
      end: times[i + 1],
      startWithZone: targetStartMoment ? targetStartMoment : times[i],
      endWithZone: targetEndMoment ? targetEndMoment : times[i + 1],
    });
  }
  return arr;
};

export const formatDateString = dateString => {
  if (dateString) {
    if (dateString.includes('/')) {
      return dateString;
    }
    const [day, month, year] = dateString.split('-');
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  }
  return null;
};
export const formatDateMoment = dateString => {
  if (dateString) {
    if (dateString.includes('-')) {
      return dateString;
    }
    const [day, month, year] = dateString.split('/');
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate;
  }
  return null;
};

export const wordBasedOnCount = (number, double, single) => {
  if (number > 2 && number < 11) {
    return double;
  } else {
    return single;
  }
};

export const convertToArabicNumber = englishNumber => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return englishNumber.toString().replace(/\d/g, match => {
    return arabicNumbers[parseInt(match)];
  });
};

export const convertToEnglishDigits = (input) => {
  const arabicToEnglishMap = {
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
  };

  return input?.replace(/[٠-٩]/g, (match) => arabicToEnglishMap[match]);
};

export function addTimers(timer1, timer2) {
  const totalSeconds1 = parseTimerToSeconds(timer1);
  const totalSeconds2 = parseTimerToSeconds(timer2);

  const sumSeconds = totalSeconds1 + totalSeconds2;

  const sumTimer = secondsToTimer(sumSeconds);

  return sumTimer;
}

export function parseTimerToSeconds(timer) {
  const timeParts = timer.split(':').map(part => parseInt(part, 10));

  let totalSeconds = 0;
  if (timeParts.length === 3) {
    totalSeconds = timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
  } else if (timeParts.length === 2) {
    totalSeconds = timeParts[0] * 60 + timeParts[1];
  } else if (timeParts.length === 1) {
    totalSeconds = timeParts[0];
  }

  return totalSeconds;
}

export function secondsToTimer(seconds) {
  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);
  const remainingSecondsFinal = remainingSeconds % 60;
  let formattedTimer = '';

  if (hours > 0) {
    formattedTimer += `${String(hours).padStart(2, '0')}:`;
  }

  formattedTimer += `${String(minutes).padStart(2, '0')}:${String(
    remainingSecondsFinal,
  ).padStart(2, '0')}`;

  return formattedTimer;
}

export const convertToTime = (isoString) => {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const timeStr = hours + ':' + minutesStr + ' ' + ampm;
  return timeStr;
};