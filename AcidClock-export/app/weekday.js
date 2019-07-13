let locale = {
  'en': {
    weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday',
    weekdaysShort : 'Sun_Mon_Tue_Wed_Thu_Fri_Sat',
    months : 'January_February_March_April_May_June_July_August_September_October_November_December',
    monthsShort : 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'    
  },
  'de': {
    weekdays: 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag',
    weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.',
    months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember',
    monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'
  },
  'nl': {
    weekdays: 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag',
    weekdaysShort : 'zo._ma._di._wo._do._vr._za.',
    months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december',
    monthsShort : 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'
  },
  'it': {
    weekdays: 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato',  
    weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab',
    months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre',
    monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'
  },
  'fr': {
    weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi',
    weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.',
    months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre',
    monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'
  },
  'es': {
    weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado',
    weekdaysShort : 'dom._lun._mar._mié._jue._vie._sáb.',
    months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre',
    monthsShort : 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'
  },
  'nb': {
    weekdays: 'søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag',    
    weekdaysShort : 'sø._ma._ti._on._to._fr._lø.',
    months : 'januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember',
    monthsShort : 'jan._feb._mars_april_mai_juni_juli_aug._sep._okt._nov._des.'
  },
  'sv': {
    weekdays: 'söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag',
    weekdaysShort : 'sön_mån_tis_ons_tor_fre_lör',
    months : 'januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december',
    monthsShort : 'jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec'
  },
  'hu': {
    weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat',
    weekdaysShort :  'vas_hét_kedd_sze_csüt_pén_szo',
    months : 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december',
    monthsShort : 'jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec'
  },
  'pl': {
    weekdays: 'niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota', 
    weekdaysShort : 'ndz_pon_wt_śr_czw_pt_sob',
    months : 'stycznia_lutego_marca_kwietnia_maja_czerwca_lipca_sierpnia_września_października_listopada_grudnia',
    monthsShort : 'sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru'
  },
  'uk': {
    weekdays: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота',  
    weekdaysShort : 'нд_пн_вт_ср_чт_пт_сб',
    months : 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня',
    monthsShort : 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'
  },
  'ru': {
    weekdays: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота',
    weekdaysShort :  'вс_пн_вт_ср_чт_пт_сб',
    months : 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря',
    monthsShort : 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'
  },
  'zh': {
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六',
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六',
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月',
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月',
  },
  'ja': {
    weekdays: '日曜日_月曜日_火曜日_水曜日_木曜日_金曜日_土曜日',
    weekdaysShort : '周日_周一_周二_周三_周四_周五_周六',
    months : '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月',
    monthsShort : '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'
  },
  'ko': {
    weekdays: '일요일_월요일_화요일_수요일_목요일_금요일_토요일',
    weekdaysShort : '일_월_화_수_목_금_토',
    months : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월',
    monthsShort : '1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월'
  },
  'sw': {
    weekdays: 'Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi',
    weekdaysShort : 'Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos',
    months : 'Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba',
    monthsShort : 'Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des'
  }
}

var currentLanguage = null;
var currentLanguageData = null;

// Making the lazy split: OOM error if splitting everithing at once
let getLanguage = function(language) {
  if (language != currentLanguage) {
    let rawData = locale[language];
    currentLanguageData = {
      weekdays: rawData.weekdays.split("_"),
      weekdaysShort : rawData.weekdaysShort.split("_"),
      months : rawData.months.split("_"),
      monthsShort : rawData.monthsShort.split("_"),
    }
    currentLanguage = language;    
  }
  return currentLanguageData;
}

export function getWeekdayName(language, number) {
  return getLanguage(language)["weekdays"][number];  
}

export function getShortWeekdayName(language, number) {
  return getLanguage(language)["weekdaysShort"][number];  
}

export function getMonthName(language, number) {
  return getLanguage(language)["months"][number];  
}

export function getShortMonthName(language, number) {
  return getLanguage(language)["monthsShort"][number];  
}