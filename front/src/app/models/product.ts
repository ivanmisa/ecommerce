export class Product{
	constructor(
		public _id: String,
		public name: String,
		public description: String,
        public gender: String,
		public price: number,
        public category: String,
        public color: [{color: String, number: number}],
        public by: String,
		public file
	){}
}
