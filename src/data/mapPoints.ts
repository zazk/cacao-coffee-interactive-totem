export interface MapPoint {
	id: number;
	section: string;
	text: string;
	x: number;
	y: number;
	background: string;
}

export const mapPoints: MapPoint[] = [
	{
		id: 1,
		section: 'Bosques y biodiversidad',
		text: '¿Sabías que el Perú es el cuarto país con más bosques tropicales del mundo? ¡Y el segundo en toda la Amazonía!',
		x: 81,
		y: 93,
		background: '/images/01.jpg',
	},
	{
		id: 2,
		section: 'Bosques y biodiversidad',
		text: 'Gracias a nuestra geografía y clima somos un país megadiverso. ¡Tenemos aproximadamente el 60% de las variedades de cacao conocidas en el mundo! Entre ellas el Chuncho de Cusco o el Blanco de Piura.',
		x: 58,
		y: 82,
		background: '/images/02.jpg',
	},
	{
		id: 3,
		section: 'Bosques y biodiversidad',
		text: 'Los bosques amazónicos son el motor natural del ciclo del agua que hace posible la producción agrícola. ¡Un solo árbol grande puede transpirar hasta 1,000 litros de agua al día, alimentando los "ríos voladores" que producen lluvias para cultivos como el café y el cacao!',
		x: 24,
		y: 76,
		background: '/images/03.jpg',
	},
	{
		id: 4,
		section: 'El gran desafío ambiental',
		text: 'Y como debes saber, Europa compra un tercio del café y cacao del mundo, ¡Por eso, las decisiones que toma este mercado son importantes para los productores y exportadores peruanos!',
		x: 45,
		y: 69,
		background: '/images/04.jpg',
	},
	{
		id: 5,
		section: 'El gran desafío ambiental',
		text: 'Para frenar la deforestación, la Unión Europea creó el Reglamento EUDR, que promueve la comercialización de productos provenientes de áreas donde los bosques son protegidos y gestionados de manera sostenible.',
		x: 68,
		y: 60,
		background: '/images/05.jpg',
	},
	{
		id: 6,
		section: 'El gran desafío ambiental',
		text: 'El reglamento EUDR contempla a 7 productos: Café, soya, aceite de palma, madera, caucho natural, ganado bovino (carne y cuero) y cacao, y sus productos derivados como el chocolate.',
		x: 31,
		y: 52,
		background: '/images/06.jpg',
	},
	{
		id: 7,
		section: 'Agricultura sostenible',
		text: 'Cumplir con el EUDR implica producir de manera sostenible y libre de deforestación. Esto comienza con la adopción de prácticas que aprovechan los beneficios que los bosques brindan a los cultivos.',
		x: 61,
		y: 43,
		background: '/images/07.jpg',
	},
	{
		id: 8,
		section: 'Agricultura sostenible',
		text: 'Cultivar imitando las funciones del bosque es cultivar de manera sostenible. ¡La cobertura forestal crea y mantiene un microclima que los protege frente a plagas, sequías, friajes y otros eventos climáticos, ayudando a mantener su productividad a lo largo del tiempo!',
		x: 28,
		y: 32,
		background: '/images/08.jpg',
	},
	{
		id: 9,
		section: 'Agricultura sostenible',
		text: 'La sostenibilidad se construye trabajando en equipo. ¡Cuando productores, organizaciones y exportadores registran su información y fortalecen la trazabilidad, generan confianza y crean más oportunidades para acceder a mercados cada vez más exigentes!',
		x: 61,
		y: 27,
		background: '/images/09.jpg',
	},
	{
		id: 10,
		section: 'Perú hacia una producción sostenible',
		text: 'El Midagri ha creado la herramienta "Agrodigital". Una de sus funciones es geolocalizar las parcelas de forma gratuita. ¡La geolocalización es una exigencia de los mercados internacionales para demostrar una producción libre de deforestación!',
		x: 49,
		y: 17,
		background: '/images/10.jpg',
	},
	{
		id: 11,
		section: 'Perú hacia una producción sostenible',
		text: 'Recuerda que, para poder usar "Agrodigital", el productor debe estar inscrito en el Padrón de Productores Agrarios (PPA).',
		x: 71,
		y: 10,
		background: '/images/11.jpg',
	},
	{
		id: 12,
		section: 'Perú hacia una producción sostenible',
		text: 'El Perú, con el apoyo de la cooperación internacional, está fortaleciendo las capacidades de productores y organizaciones para impulsar una producción sostenible, libre de deforestación y competitiva en los mercados internacionales.',
		x: 53,
		y: 3,
		background: '/images/12.jpg',
	},
];