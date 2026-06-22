const pptxgen = require('pptxgenjs');

let pres = new pptxgen();

pres.author = 'Donca S.L.';
pres.company = 'Servicios Multiples Donca S.L.';
pres.subject = 'Digitalización de Partes de Incidencias';
pres.title = 'Presentación de Ventas';

// Slide 1
let slide1 = pres.addSlide();
slide1.background = { color: '1A365D' }; // Dark Blue
slide1.addText('Digitalización y Control de Partes de Incidencias', { x: 0.5, y: 2, w: 9, h: 1, fontSize: 32, color: 'FFFFFF', bold: true, align: 'center' });
slide1.addText('Optimizando la gestión diaria del parking', { x: 0.5, y: 3, w: 9, h: 1, fontSize: 20, color: 'E2E8F0', align: 'center' });
slide1.addText('Presentado por: __________________', { x: 0.5, y: 4.5, w: 9, h: 1, fontSize: 16, color: 'FFFFFF', italic: true, align: 'center' });

// Slide 2
let slide2 = pres.addSlide();
slide2.addText('El Problema Actual', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide2.addText([
  { text: 'Uso excesivo de papel y archivadores físicos.', options: { bullet: { type: 'number' }, color: 'E53E3E' } },
  { text: 'Pérdida de tiempo redactando y calculando a mano.', options: { bullet: { type: 'number' }, color: 'E53E3E' } },
  { text: 'Dificultad para buscar incidencias de meses pasados.', options: { bullet: { type: 'number' }, color: 'E53E3E' } },
  { text: 'Errores humanos y problemas para leer algunas letras.', options: { bullet: { type: 'number' }, color: 'E53E3E' } }
], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 20, color: '2D3748', margin: 0.2 });

// Slide 3
let slide3 = pres.addSlide();
slide3.addText('La Solución: Aplicación a Medida', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide3.addText([
  { text: 'Plataforma Web Privada 100% a medida.', options: { bullet: true, color: '38A169' } },
  { text: 'Accesible desde cualquier móvil, tablet o PC del parking.', options: { bullet: true, color: '38A169' } },
  { text: 'Generación instantánea de partes en formato PDF oficial.', options: { bullet: true, color: '38A169' } },
  { text: 'Guardado automático y centralizado en la Nube.', options: { bullet: true, color: '38A169' } }
], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 20, color: '2D3748', margin: 0.2 });

// Slide 4
let slide4 = pres.addSlide();
slide4.addText('Funcionalidades Clave (La Magia)', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide4.addText([
  { text: 'Calculadora Inteligente:', options: { bullet: true, bold: true, color: '2D3748' } },
  { text: ' Suma automáticamente los coches de la semana cada domingo.', options: { color: '4A5568' } },
  { text: 'Autoguardado en Borrador:', options: { bullet: true, bold: true, breakLine: true, color: '2D3748' } },
  { text: ' Si se cierra la página por error, no se pierde lo escrito.', options: { color: '4A5568' } },
  { text: 'Gestión de Personal en Vivo:', options: { bullet: true, bold: true, breakLine: true, color: '2D3748' } },
  { text: ' Base de datos actualizable al instante para empleados y responsables.', options: { color: '4A5568' } }
], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 20, margin: 0.2 });

// Slide 5
let slide5 = pres.addSlide();
slide5.addText('Seguridad y Privacidad', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide5.addText([
  { text: 'Acceso restringido por usuario y contraseña.', options: { bullet: true } },
  { text: 'Contraseñas encriptadas (Algoritmo pgcrypto). Nadie puede robarlas.', options: { bullet: true } },
  { text: 'Base de datos profesional en tiempo real (PostgreSQL alojada en Nube).', options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 20, color: '2D3748', margin: 0.2 });

// Slide 6
let slide6 = pres.addSlide();
slide6.addText('Retorno de Inversión (Por qué vale la pena)', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide6.addText([
  { text: 'Ahorro de +15 horas mensuales en gestión administrativa.', options: { bullet: true } },
  { text: 'Reducción a casi cero en costes de papel y tinta de impresora.', options: { bullet: true } },
  { text: 'Imagen impecable, moderna y profesional ante auditorías o gerencia.', options: { bullet: true } },
  { text: 'Sin necesidad de instalar nada: funciona vía web al instante.', options: { bullet: true } }
], { x: 0.5, y: 1.8, w: 9, h: 3, fontSize: 20, color: '2D3748', margin: 0.2 });

// Slide 7
let slide7 = pres.addSlide();
slide7.background = { color: 'EDF2F7' };
slide7.addText('Presupuesto y Mantenimiento', { x: 0.5, y: 0.5, w: 9, h: 1, fontSize: 28, color: '1A365D', bold: true });
slide7.addText('Desarrollo del Software a Medida', { x: 0.5, y: 1.8, w: 9, h: 0.5, fontSize: 22, color: '2B6CB0', bold: true });
slide7.addText('Pago único de implantación: 950 €', { x: 0.5, y: 2.3, w: 9, h: 0.5, fontSize: 20, color: '2D3748' });

slide7.addText('Hosting, Servidores y Mantenimiento', { x: 0.5, y: 3.2, w: 9, h: 0.5, fontSize: 22, color: '2B6CB0', bold: true });
slide7.addText('Cuota mensual operativa: 40 € / mes', { x: 0.5, y: 3.7, w: 9, h: 0.5, fontSize: 20, color: '2D3748' });

const dest = 'c:\\Users\\tacky\\OneDrive\\Escritorio\\Presentacion_Digitalizacion_Parking.pptx';
pres.writeFile({ fileName: dest }).then(fileName => {
    console.log(`Creado con exito en: ${fileName}`);
});
