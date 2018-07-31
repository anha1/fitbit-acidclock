let weekdays = {
  'en': 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
  'de': 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
  'nl': 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
  'it': 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),  
  'fr': 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  'es': 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  'nb': 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag'.split('_'),    
  'sv': 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag'.split('_'),
  'hu': 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
  'pl':  'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota'.split('_'),    
  'uk': 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),  
  'ru': 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
  'zh': '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  'ja': '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日'.split('_'),
  'ko': '일요일_월요일_화요일_수요일_목요일_금요일_토요일'.split('_'),
  'sw': 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi'.split('_'),
}

export function getWeekdayName(language, number) {
  return weekdays[language][number];  
}