const test = require('node:test');
const assert = require('node:assert/strict');
const { studioToday, validDate, validContact, makeSummary, withCatalogReference } = require('../pages/paula/js/booking.js');

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

test('contact accepts email, phone or Instagram and rejects unusable details', () => {
  for (const value of ['paula@example.com', '+1 (201) 555-0123', '@paulaadaniiela']) assert.equal(validContact(value), true);
  for (const value of ['', '   ', 'my phone', '123', 'a@b', 'hello@', '@not valid']) assert.equal(validContact(value), false);
});

test('request summary preserves the actual choices and makes confirmation explicit', () => {
  const text = makeSummary({ name: ' Ana ', contact: '@ana', date: '2026-11-15', period: 'afternoon', message: ' Diseño azul ' }, 'Nail art', 'es');
  assert.match(text, /Nombre: Ana\nContacto: @ana\nServicio: Nail art/);
  assert.match(text, /domingo, 15 de noviembre de 2026/);
  assert.match(text, /Franja preferida: Tarde/);
  assert.match(text, /Mi idea: Diseño azul/);
  assert.match(text, /pendiente de confirmar disponibilidad, precio y detalles/);
  assert.doesNotMatch(text, /confirmada|reservada/);
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
  const text=makeSummary({name:'Ana',contact:'@ana',date:'2026-12-02',period:'morning',message:'Me gusta azul.'},'Nails & nail art');
  assert.match(text,/^Hi, Paula/);assert.match(text,/Wednesday, December 2, 2026/);
  assert.match(text,/Preferred time of day: Morning/);assert.match(text,/My idea: Me gusta azul\./);
  assert.match(text,/wait to confirm availability, pricing/);
});
test('automatic references can change language without duplicating or changing user text',()=>{
  const first=withCatalogReference('Quiero flores.','French & flowers');
  assert.match(first.automatic,/I’m inspired by/);
  const es=withCatalogReference(first.message,'French y flores',first.automatic,'es');
  assert.equal(es.message,'Quiero flores.\n\nMe inspira el trabajo «French y flores» del catálogo.');
  const en=withCatalogReference(es.message,'French & flowers',es.automatic,'en');
  assert.equal(en.message,first.message);
});
