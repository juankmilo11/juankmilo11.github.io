(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.PacaSchedule = api;
})(typeof window !== 'undefined' ? window : null, function() {
  'use strict';
  const ZONE = 'America/New_York';
  const minutes = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(value || '') ? Number(value.slice(0,2))*60 + Number(value.slice(3)) : NaN;
  const timeString = value => `${String(Math.floor(value/60)).padStart(2,'0')}:${String(value%60).padStart(2,'0')}`;
  function studioNow(now = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23' }).formatToParts(now);
    const get = name => parts.find(part => part.type === name).value;
    return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour'))*60 + Number(get('minute')) };
  }
  function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false;
    const date = new Date(`${value}T12:00:00Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
  }
  function addDays(value, count) {
    const date = new Date(`${value}T12:00:00Z`);date.setUTCDate(date.getUTCDate()+count);return date.toISOString().slice(0,10);
  }
  function validateConfig(config) {
    if(config?.version !== 1 || config.timeZone !== ZONE || config.open !== '07:00' || config.close !== '19:00' || JSON.stringify(config.weekdays) !== '[1,2,3,4,5]' || config.slotMinutes !== 30 || !Number.isInteger(config.horizonDays) || config.horizonDays < 1 || config.horizonDays > 365) throw new Error('Invalid schedule');
    if(!Array.isArray(config.blocked)||!Array.isArray(config.closedDates)||!config.durationMinutes) throw new Error('Invalid schedule');
    for(const block of config.blocked) if(!validDate(block.date)||!Number.isFinite(minutes(block.start))||!Number.isFinite(minutes(block.end))||minutes(block.end)<=minutes(block.start)) throw new Error('Invalid busy interval');
    for(const date of config.closedDates) if(!validDate(date)) throw new Error('Invalid closed date');
    for(const value of [...Object.values(config.durationMinutes),config.removalMinutes]) if(value !== null && (!Number.isInteger(value)||value<1||value>720)) throw new Error('Invalid duration');
    return config;
  }
  function serviceDuration(config, details={}) {
    const key=details.service==='nails' ? details.nailType || 'nails' : details.service;
    const base=config.durationMinutes[key]??config.estimates?.[key]?.maxMinutes;
    const extraRemoval=details.service==='nails' && ['yes','unsure'].includes(details.removal) && key!=='removalOnly';
    const removal=config.removalMinutes??config.estimates?.removalExtra?.maxMinutes;
    if(!base || (extraRemoval && !removal)) return null;
    return base + (extraRemoval ? removal : 0);
  }
  function estimate(config, details={}) {
    const key=details.service==='nails' ? details.nailType || 'nails' : details.service;
    const base=config?.estimates?.[key];if(!base)return null;
    const result={...base};
    const extra=details.service==='nails'&&['yes','unsure'].includes(details.removal)&&key!=='removalOnly'?config.estimates.removalExtra:null;
    if(extra)for(const name of ['minMinutes','maxMinutes','minPrice','maxPrice'])result[name]+=extra[name];
    return result;
  }
  function formatEstimate(config, details, language='en') {
    const value=estimate(config,details);if(!value)return '';
    const price=n=>new Intl.NumberFormat(language==='es'?'es-CO':'en-US',{maximumFractionDigits:2}).format(n);
    return `${language==='es'?'Estimado':'Estimate'}: ${value.minMinutes}–${value.maxMinutes} min · USD $${price(value.minPrice)}–$${price(value.maxPrice)}. ${language==='es'?'Paula confirma tiempo y precio final.':'Paula confirms final time and price.'}`;
  }
  function dayOpen(date, config, now=new Date()) {
    const today=studioNow(now).date;
    return validDate(date) && date>=today && date<=addDays(today,config.horizonDays) && config.weekdays.includes(new Date(`${date}T12:00:00Z`).getUTCDay()) && !config.closedDates.includes(date);
  }
  function slots(date,config,details={},now=new Date()) {
    if(!dayOpen(date,config,now)) return [];
    const current=studioNow(now), duration=serviceDuration(config,details), span=duration || config.slotMinutes;
    const busy=config.blocked.filter(item=>item.date===date);
    const result=[];
    for(let start=minutes(config.open);start+span<=minutes(config.close);start+=config.slotMinutes) {
      if(date===current.date && start<=current.minutes) continue;
      const end=start+span;
      result.push({time:timeString(start),end:duration?timeString(end):null,available:!busy.some(item=>start<minutes(item.end)&&end>minutes(item.start)),duration});
    }
    return result;
  }
  return {ZONE,minutes,timeString,studioNow,validDate,addDays,validateConfig,serviceDuration,estimate,formatEstimate,dayOpen,slots};
});
