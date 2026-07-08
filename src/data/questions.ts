export interface Question {
	id: number;
	text: string;
	options: { id: string; text: string }[];
	correctId: string;
}

export const questions: Question[] = [
	{
		id: 1,
		text: '¿Qué puesto ocupa el Perú a nivel mundial en cantidad de bosques tropicales?',
		options: [
			{ id: 'a', text: 'El cuarto puesto del mundo ¡Somos potencia forestal!' },
			{ id: 'b', text: 'El primer puesto.' },
			{ id: 'c', text: 'El último lugar, justo detrás de los equipos que nunca clasifican al mundial.' },
		],
		correctId: 'a',
	},
	{
		id: 2,
		text: '¿Qué tienen de especial los cacaos nativos peruanos como el Chuncho de Cusco o el Blanco de Piura?',
		options: [
			{ id: 'a', text: 'Son reconocidos internacionalmente como cacaos únicos y finos de aroma.' },
			{ id: 'b', text: 'Si los siembras en una cancha de fútbol crecen a pesar de que los pisen.' },
			{ id: 'c', text: 'Te hacen crecer en estatura.' },
		],
		correctId: 'a',
	},
	{
		id: 3,
		text: 'Cuidar el suelo hoy garantiza cosechas mañana. ¿Por qué es tan importante un suelo sano?',
		options: [
			{
				id: 'a',
				text: 'Porque protege el agua, la biodiversidad y es la base de una agricultura productiva, ecosistemas resilientes y un ambiente sostenible.',
			},
			{ id: 'b', text: 'Porque si el suelo está feo la pelota no rueda bien y terminamos jugando en el barro.' },
			{ id: 'c', text: 'Porque un suelo fértil es el único lugar donde no hay plagas.' },
		],
		correctId: 'a',
	},
	{
		id: 4,
		text: 'Si la Unión Europea está tan lejos, ¿por qué se tomó la molestia de crear una regla tan estricta como el EUDR para la compra del café y el cacao?',
		options: [
			{
				id: 'a',
				text: 'Porque se preocupan por nuestro planeta y quieren asegurarse de que sus compras no destruyan los bosques del mundo.',
			},
			{
				id: 'b',
				text: 'Porque si ayudan a cuidar la selva central de Perú vamos a clasificar directamente al próximo mundial.',
			},
			{ id: 'c', text: 'Porque querían inventar una nueva regla para que sea más difícil desayunar.' },
		],
		correctId: 'a',
	},
	{
		id: 5,
		text: '¿Qué productos están contemplados en el EUDR?',
		options: [
			{ id: 'a', text: '7 productos, entre los cuales está el café, el cacao y la palma aceitera.' },
			{ id: 'b', text: '5 productos, entre los cuales está la cebollita china y sus derivados como el chaufa.' },
			{ id: 'c', text: 'Solo 2 productos: el café y el cacao.' },
		],
		correctId: 'a',
	},
	{
		id: 6,
		text: '¿Qué significa el término "cadenas libres de deforestación"?',
		options: [
			{ id: 'a', text: 'Que se pondrán cadenas a las personas que se les encuentre deforestando la Amazonía.' },
			{
				id: 'b',
				text: 'Es asegurar que todo el "camino" que recorre el cacao o cualquier cultivo —desde que el agricultor lo siembra en la selva hasta que llega a la taza del consumidor— se haga sin cortar ni quemar ni un solo árbol del bosque.',
			},
			{ id: 'c', text: 'Son unas cadenas de cuero que amarra los cultivos para evitar maltratar el suelo.' },
		],
		correctId: 'b',
	},
	{
		id: 7,
		text: '¿Qué es "Agrodigital"?',
		options: [
			{ id: 'a', text: 'Un aplicativo que indica los precios de diferentes cultivos de cacao.' },
			{ id: 'b', text: 'Un aplicativo para poder comprar semillas.' },
			{
				id: 'c',
				text: 'Un aplicativo móvil creado por el Midagri para geolocalizar gratis parcelas agrícolas.',
			},
		],
		correctId: 'c',
	},
	{
		id: 8,
		text: '¿Qué necesitas para acceder al "Agrodigital"?',
		options: [
			{
				id: 'a',
				text: 'Ser productor agrícola o pecuario y estar inscrito en el PPA (Padrón de Productores Agrarios).',
			},
			{ id: 'b', text: 'Hacer un pago único de 5 soles y descargar el APP.' },
			{ id: 'c', text: 'Solo bajar el aplicativo y entrar directo.' },
		],
		correctId: 'a',
	},
];
