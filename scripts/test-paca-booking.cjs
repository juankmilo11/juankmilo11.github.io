const test = require('node:test');
const assert = require('node:assert/strict');
const { studioToday, validDate, validWhatsApp, validNationalWhatsApp, composeWhatsApp, validInstagram, normalizeWhatsApp, makeSummary, withCatalogReference } = require('../pages/paula/js/booking.js');

test('booking dates use New Jersey time, including daylight saving', () => {
  assert.equal(studioToday(new Date('2026-11-15T02:30:00Z')), '2026-11-14');
  assert.equal(studioToday(new Date('2026-07-02T03:30:00Z')), '2026-07-01');
  assert.equal(studioToday(new Date('2026-11-15T05:30:00Z')), '2026-11-15');
});

test('only real dates from today onward are accepted', () => {
  assert.equal(validDate('2026-11-13', '2026-11-14'), false);
  assert.equal(validDate('2026-11-14', '2026-11-14'), true);
  assert.equal(validDate('2026-11-15', '2026-11-14'), true);
  assert.equal(validDate('2027-02-29', '2026-11-14'), false);
  assert.equal(validDate('2028-02-29', '2026-11-14'), true);
  assert.equal(validDate('2026-11-31', '2026-11-14'), false);
  assert.equal(validDate('2026-13-01', '2026-11-14'), false);
  assert.equal(validDate('', '2026-11-14'), false);
});

test('WhatsApp requires an international phone number and Instagram is optional', () => {
  for (const value of ['+1 (201) 555-0123', '+57 300 123 4567']) assert.equal(validWhatsApp(value), true);
  for (const value of ['', '@anna', 'anna@example.com', '3001234567', '+012345678', '+1 123']) assert.equal(validWhatsApp(value), false);
  assert.equal(normalizeWhatsApp('+1 (201) 555-0123'), '+12015550123');
  for (const value of ['', 'anna', '@anna_studio.1']) assert.equal(validInstagram(value), true);
  for (const value of ['@not valid', 'https://instagram.com/anna', '@', '.']) assert.equal(validInstagram(value), false);
});

test('request summary preserves the actual choices and makes confirmation explicit', () => {
  const text = makeSummary({ name: ' Ana ', whatsapp: '+573001234567', instagram: '@ana', date: '2026-11-15', time: '15:00', message: ' Diseño azul ' }, 'Nail art', 'es');
  assert.match(text, /Nombre: Ana\nWhatsApp: \+573001234567\nInstagram: @ana\nServicio: Nail art/);
  assert.match(text, /domingo, 15 de noviembre de 2026/);
  assert.match(text, /Hora de inicio solicitada: 15:00/);
  assert.match(text, /New Jersey \(New York\)/);
  assert.doesNotMatch(text, /America\/New_York/);
  assert.match(text, /Mi idea: Diseño azul/);
  assert.match(text, /sujeta a confirmación por Paula/);
  assert.doesNotMatch(text, /confirmada|reservada/);
});

test('the two country choices combine ten national digits into the stored international number', () => {
  assert.equal(composeWhatsApp('201 555 0123', '+1'), '+12015550123');
  assert.equal(composeWhatsApp('300 123 4567', '+57'), '+573001234567');
  for (const [number, code] of [['300123456', '+57'], ['30012345678', '+57'], ['+573001234567', '+57'], ['2015550123', '+44'], ['', '+1']]) {
    assert.equal(validNationalWhatsApp(number, code), false);
    assert.equal(composeWhatsApp(number, code), '');
  }
});

test('catalog references preserve the idea and replace previous automatic references', () => {
  const first = withCatalogReference('Quisiera azul y flores.', 'French floral', '', 'es');
  assert.equal(first.message, 'Quisiera azul y flores.\n\nMe inspira el trabajo «French floral» del catálogo.');
  const again = withCatalogReference(first.message, 'French floral', first.automatic, 'es');
  assert.equal(again.message, first.message);
  const second = withCatalogReference(first.message + '\nY un acabado brillante.', 'Pink chrome', first.automatic, 'es');
  assert.equal(second.message, 'Quisiera azul y flores.\nY un acabado brillante.\n\nMe inspira el trabajo «Pink chrome» del catálogo.');
  assert.doesNotMatch(second.message, /French floral/);
});

test('catalog references never truncate user text or exceed the message limit', () => {
  const userText = 'a'.repeat(700);
  const full = withCatalogReference(userText, 'French floral', '', 'es');
  assert.equal(full.message, userText);
  assert.equal(full.added, false);
  const line = 'Me inspira el trabajo «French floral» del catálogo.';
  const manual = withCatalogReference(line, 'French floral', '', 'es');
  assert.equal(manual.message, line);
  assert.equal(manual.automatic, '');
  const edited = withCatalogReference('Mi referencia editada.', 'Pink chrome', line, 'es');
  assert.ok(edited.message.startsWith('Mi referencia editada.'));
  assert.ok(edited.message.length <= 700);
});

test('English is the default request language and user text is never translated',()=>{
  const text=makeSummary({name:'Ana',whatsapp:'+573001234567',instagram:'@ana',date:'2026-12-02',time:'09:00',message:'Me gusta azul.'},'Nails & nail art');
  assert.match(text,/^Name: Ana/);assert.match(text,/Wednesday, December 2, 2026/);
  assert.match(text,/Requested start time: 09:00/);assert.match(text,/My idea: Me gusta azul\./);
  assert.match(text,/subject to confirmation by Paula/);
});
test('automatic references can change language without duplicating or changing user text',()=>{
  const first=withCatalogReference('Quiero flores.','French & flowers');
  assert.match(first.automatic,/I’m inspired by/);
  const es=withCatalogReference(first.message,'French y flores',first.automatic,'es');
  assert.equal(es.message,'Quiero flores.\n\nMe inspira el trabajo «French y flores» del catálogo.');
  const en=withCatalogReference(es.message,'French & flowers',es.automatic,'en');
  assert.equal(en.message,first.message);
});
