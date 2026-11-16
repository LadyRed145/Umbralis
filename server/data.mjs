/** Catálogo ficticio de demostración. Títulos y autores son obras conocidas; precios son ilustrativos. */
export const categories = Object.freeze([
  { id: 'clasicos', name: 'Clásicos', icon: '✦', detail: 'Historias que atraviesan generaciones.', theme: 'pearl' },
  { id: 'terror', name: 'Terror', icon: '☾', detail: 'Para quienes disfrutan la oscuridad literaria.', theme: 'garnet' },
  { id: 'fantasia', name: 'Fantasía', icon: '✧', detail: 'Otros mundos a una página de distancia.', theme: 'lilac' },
  { id: 'ciencia-ficcion', name: 'Ciencia ficción', icon: '✳', detail: 'Futuros, inventos y preguntas imposibles.', theme: 'ice' },
  { id: 'misterio', name: 'Misterio', icon: '⌕', detail: 'Pistas, secretos y grandes enigmas.', theme: 'bronze' },
  { id: 'romance', name: 'Romance', icon: '♡', detail: 'Encuentros y emociones memorables.', theme: 'rose' },
]);

export const books = Object.freeze([
  { id: 'dracula', title: 'Drácula', author: 'Bram Stoker', year: 1897, categoryId: 'terror', pages: 418, price: 14990, blurb: 'Cartas, diarios y un castillo remoto dan forma a una de las historias góticas más célebres.' },
  { id: 'frankenstein', title: 'Frankenstein', author: 'Mary Shelley', year: 1818, categoryId: 'terror', pages: 280, price: 12990, blurb: 'Una creación extraordinaria confronta a su creador con los límites de la responsabilidad.' },
  { id: 'jekyll-hyde', title: 'El extraño caso del Dr. Jekyll y Mr. Hyde', author: 'R. L. Stevenson', year: 1886, categoryId: 'terror', pages: 112, price: 10990, blurb: 'Una investigación sobre las dos caras de la condición humana.' },
  { id: 'quijote', title: 'Don Quijote de la Mancha', author: 'Miguel de Cervantes', year: 1605, categoryId: 'clasicos', pages: 863, price: 22990, blurb: 'Un caballero idealista emprende aventuras que confunden los libros con el mundo.' },
  { id: 'moby-dick', title: 'Moby Dick', author: 'Herman Melville', year: 1851, categoryId: 'clasicos', pages: 635, price: 18990, blurb: 'La búsqueda de una ballena blanca se transforma en una travesía obsesiva.' },
  { id: 'metamorfosis', title: 'La metamorfosis', author: 'Franz Kafka', year: 1915, categoryId: 'clasicos', pages: 90, price: 9990, blurb: 'Una mañana inexplicable altera para siempre la rutina de Gregor Samsa.' },
  { id: 'alicia', title: 'Alicia en el país de las maravillas', author: 'Lewis Carroll', year: 1865, categoryId: 'fantasia', pages: 192, price: 13990, blurb: 'Una caída por la madriguera conduce a un mundo tan brillante como absurdo.' },
  { id: 'oz', title: 'El maravilloso mago de Oz', author: 'L. Frank Baum', year: 1900, categoryId: 'fantasia', pages: 154, price: 12990, blurb: 'Dorothy sigue el camino amarillo en busca de un regreso a casa.' },
  { id: 'peter-pan', title: 'Peter Pan', author: 'J. M. Barrie', year: 1911, categoryId: 'fantasia', pages: 208, price: 11990, blurb: 'La infancia eterna abre las puertas del mágico País de Nunca Jamás.' },
  { id: 'maquina-tiempo', title: 'La máquina del tiempo', author: 'H. G. Wells', year: 1895, categoryId: 'ciencia-ficcion', pages: 128, price: 10990, blurb: 'Un viajero descubre cómo podría cambiar la humanidad con el paso de los milenios.' },
  { id: 'guerra-mundos', title: 'La guerra de los mundos', author: 'H. G. Wells', year: 1898, categoryId: 'ciencia-ficcion', pages: 192, price: 13990, blurb: 'Una invasión de otro mundo desafía lo que la humanidad creía seguro.' },
  { id: 'tierra-luna', title: 'De la Tierra a la Luna', author: 'Julio Verne', year: 1865, categoryId: 'ciencia-ficcion', pages: 240, price: 13990, blurb: 'La imaginación y la ingeniería impulsan un proyecto para alcanzar la Luna.' },
  { id: 'sherlock', title: 'Las aventuras de Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892, categoryId: 'misterio', pages: 307, price: 15990, blurb: 'Una colección de casos resueltos con observación, lógica y una pizca de audacia.' },
  { id: 'piedra-lunar', title: 'La piedra lunar', author: 'Wilkie Collins', year: 1868, categoryId: 'misterio', pages: 528, price: 17990, blurb: 'La desaparición de una joya abre un intrincado rompecabezas de sospechas.' },
  { id: 'mujer-blanco', title: 'La mujer de blanco', author: 'Wilkie Collins', year: 1859, categoryId: 'misterio', pages: 672, price: 16990, blurb: 'Una aparición nocturna inicia una intriga de secretos e identidades.' },
  { id: 'orgullo-prejuicio', title: 'Orgullo y prejuicio', author: 'Jane Austen', year: 1813, categoryId: 'romance', pages: 432, price: 14990, blurb: 'Elizabeth Bennet desafía las apariencias, las convenciones y sus propias impresiones.' },
  { id: 'jane-eyre', title: 'Jane Eyre', author: 'Charlotte Brontë', year: 1847, categoryId: 'romance', pages: 532, price: 17990, blurb: 'Una joven institutriz construye su voz y su destino entre afectos y secretos.' },
  { id: 'persuasion', title: 'Persuasión', author: 'Jane Austen', year: 1817, categoryId: 'romance', pages: 248, price: 11990, blurb: 'Una segunda oportunidad pone a prueba la memoria y los sentimientos.' },
]);
