import moment from 'moment';

export const timeZones = [
  {
    value: 'Pacific/Midway',
    label: `Midway Island, Samoa`,
  },
  {
    value: 'America/Adak',
    label: `Hawaii-Aleutian`,
  },
  {
    value: 'Etc/GMT+10',
    label: `Hawaii`,
  },
  {
    value: 'Pacific/Marquesas',
    label: `Marquesas Islands`,
  },
  {
    value: 'Pacific/Gambier',
    label: `Gambier Islands`,
  },
  {
    value: 'America/Anchorage',
    label: `Alaska`,
  },
  {
    value: 'America/Ensenada',
    label: `Tijuana, Baja California`,
  },
  {
    value: 'Etc/GMT+8',
    label: `Pitcairn Islands`,
  },
  {
    value: 'America/Los_Angeles',
    label: `Pacific Time (US & Canada)`,
  },
  {
    value: 'America/Denver',
    label: `Mountain Time (US & Canada)`,
  },
  {
    value: 'America/Chihuahua',
    label: `Chihuahua, La Paz, Mazatlan`,
  },
  {
    value: 'America/Dawson_Creek',
    label: `Arizona`,
  },
  {
    value: 'America/Belize',
    label: `Saskatchewan, Central America`,
  },
  {
    value: 'America/Cancun',
    label: `Guadalajara, Mexico City, Monterrey`,
  },
  {
    value: 'Chile/EasterIsland',
    label: `Easter Island`,
  },
  {
    value: 'America/Chicago',
    label: `Central Time (US & Canada)`,
  },
  {
    value: 'America/New_York',
    label: `Eastern Time (US & Canada)`,
  },
  {
    value: 'America/Havana',
    label: `Cuba`,
  },
  {
    value: 'America/Bogota',
    label: `Bogota, Lima, Quito, Rio Branco`,
  },
  {
    value: 'America/Caracas',
    label: `Caracas`,
  },
  {
    value: 'America/Santiago',
    label: `Santiago`,
  },
  {
    value: 'America/La_Paz',
    label: `La Paz`,
  },
  {
    value: 'Atlantic/Stanley',
    label: `Faukland Islands`,
  },
  {
    value: 'America/Campo_Grande',
    label: `Brazil`,
  },
  {
    value: 'America/Goose_Bay',
    label: `Atlantic Time (Goose Bay)`,
  },
  {
    value: 'America/Glace_Bay',
    label: `Atlantic Time (Canada)`,
  },
  {
    value: 'America/St_Johns',
    label: `Newfoundland`,
  },
  {
    value: 'America/Araguaina',
    label: `UTC-3`,
  },
  {
    value: 'America/Montevideo',
    label: `Montevideo`,
  },
  {
    value: 'America/Miquelon',
    label: `Miquelon, St. Pierre`,
  },
  {
    value: 'America/Godthab',
    label: `Greenland`,
  },
  {
    value: 'America/Argentina/Buenos_Aires',
    label: `Buenos Aires`,
  },
  {
    value: 'America/Sao_Paulo',
    label: `Brasilia`,
  },
  {
    value: 'America/Noronha',
    label: `Mid-Atlantic`,
  },
  {
    value: 'Atlantic/Cape_Verde',
    label: `Cape Verde Is.`,
  },
  {
    value: 'Atlantic/Azores',
    label: `Azores`,
  },
  {
    value: 'Europe/Belfast',
    label: `Greenwich Mean Time : Belfast`,
  },
  {
    value: 'Europe/Dublin',
    label: `Greenwich Mean Time : Dublin`,
  },
  {
    value: 'Europe/Lisbon',
    label: `Greenwich Mean Time : Lisbon`,
  },
  {
    value: 'Europe/London',
    label: `Greenwich Mean Time : London`,
  },
  {value: 'Africa/Abidjan', label: `Monrovia, Reykjavik`},
  {
    value: 'Europe/Amsterdam',
    label: `Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna`,
  },
  {
    value: 'Europe/Belgrade',
    label: `Belgrade, Bratislava, Budapest, Ljubljana, Prague`,
  },
  {
    value: 'Europe/Brussels',
    label: `Brussels, Copenhagen, Madrid, Paris`,
  },
  {
    value: 'Africa/Algiers',
    label: `West Central Africa`,
  },
  {
    value: 'Africa/Windhoek',
    label: `Windhoek`,
  },
  {
    value: 'Asia/Beirut',
    label: `Beirut`,
  },
  {
    value: 'Africa/Cairo',
    label: `Cairo`,
  },
  {
    value: 'Asia/Gaza',
    label: `Gaza`,
  },
  {
    value: 'Africa/Blantyre',
    label: `Harare, Pretoria`,
  },
  {
    value: 'Asia/Jerusalem',
    label: `Jerusalem`,
  },
  {
    value: 'Europe/Minsk',
    label: `Minsk`,
  },
  {
    value: 'Asia/Damascus',
    label: `Syria`,
  },
  {
    value: 'Europe/Moscow',
    label: `Moscow, St. Petersburg, Volgograd`,
  },
  {
    value: 'Africa/Addis_Ababa',
    label: `Nairobi`,
  },
  {
    value: 'Asia/Tehran',
    label: `Tehran`,
  },
  {
    value: 'Asia/Dubai',
    label: `Abu Dhabi, Muscat`,
  },
  {
    value: 'Asia/Yerevan',
    label: `Yerevan`,
  },
  {
    value: 'Asia/Kabul',
    label: `Kabul`,
  },
  {
    value: 'Asia/Yekaterinburg',
    label: `Ekaterinburg`,
  },
  {
    value: 'Asia/Tashkent',
    label: `Tashkent`,
  },
  {
    value: 'Asia/Kolkata',
    label: `Chennai, Kolkata, Mumbai, New Delhi`,
  },
  {
    value: 'Asia/Katmandu',
    label: `Kathmandu`,
  },
  {
    value: 'Asia/Dhaka',
    label: `Astana, Dhaka`,
  },
  {
    value: 'Asia/Novosibirsk',
    label: `Novosibirsk`,
  },
  {
    value: 'Asia/Rangoon',
    label: `Yangon (Rangoon)`,
  },
  {
    value: 'Asia/Bangkok',
    label: `Bangkok, Hanoi, Jakarta`,
  },
  {
    value: 'Asia/Krasnoyarsk',
    label: `Krasnoyarsk`,
  },
  {
    value: 'Asia/Hong_Kong',
    label: `Beijing, Chongqing, Hong Kong, Urumqi`,
  },
  {
    value: 'Asia/Irkutsk',
    label: `Irkutsk, Ulaan Bataar`,
  },
  {
    value: 'Australia/Perth',
    label: `Perth`,
  },
  {
    value: 'Australia/Eucla',
    label: `Eucla`,
  },
  {
    value: 'Asia/Tokyo',
    label: `Osaka, Sapporo, Tokyo`,
  },
  {
    value: 'Asia/Seoul',
    label: `Seoul`,
  },
  {
    value: 'Asia/Yakutsk',
    label: `Yakutsk`,
  },
  {
    value: 'Australia/Adelaide',
    label: `Adelaide`,
  },
  {
    value: 'Australia/Darwin',
    label: `Darwin`,
  },
  {
    value: 'Australia/Brisbane',
    label: `Brisbane`,
  },
  {
    value: 'Australia/Hobart',
    label: `Hobart`,
  },
  {
    value: 'Asia/Vladivostok',
    label: `Vladivostok`,
  },
  {
    value: 'Australia/Lord_Howe',
    label: `Lord Howe Island`,
  },
  {
    value: 'Etc/GMT-11',
    label: `Solomon Is., New Caledonia`,
  },
  {
    value: 'Asia/Magadan',
    label: `Magadan`,
  },
  {
    value: 'Pacific/Norfolk',
    label: `Norfolk Island`,
  },
  {
    value: 'Asia/Anadyr',
    label: `Anadyr, Kamchatka`,
  },
  {
    value: 'Pacific/Auckland',
    label: `Auckland, Wellington`,
  },
  {
    value: 'Etc/GMT-12',
    label: `Fiji, Kamchatka, Marshall Is.`,
  },
  {
    value: 'Pacific/Chatham',
    label: `Chatham Islands`,
  },
  {
    value: 'Pacific/Tongatapu',
    label: `Nuku'alofa`,
  },
  {
    value: 'Pacific/Kiritimati',
    label: `Kiritimati`,
  },
];

const getTimeZonesData = () => {
  let data = JSON.parse(JSON.stringify(timeZones));
  data.forEach(item => {
    const currentTime = moment().tz(item.value).format('LT');

    item.label = item.label + ' ' + currentTime;
    return item;
  });

  return data;
};

export default getTimeZonesData;