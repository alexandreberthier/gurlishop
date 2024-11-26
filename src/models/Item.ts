
export enum Category {
    Blankets='blankets',
    Bags='bags',
    Socks='socks'
}

export interface ItemDto {
    id: string,
    displayName: string,
    desc: string,
    price: number,
    category: Category
    images: string[];
}

export class Item {
    private readonly _id: string;
    private readonly _displayName: string;
    private readonly _desc: string;
    private readonly _price: number;
    private readonly _category: Category;
    private readonly _images: string[];


    constructor(id: string, displayName: string, desc: string, price: number, category: Category, images: string[]) {
        this._id = id;
        this._displayName = displayName;
        this._desc = desc;
        this._price = price;
        this._category = category;
        this._images = images;
    }


    get id(): string {
        return this._id;
    }

    get displayName(): string {
        return this._displayName;
    }

    get desc(): string {
        return this._desc;
    }

    get price(): number {
        return this._price;
    }

    get category(): Category {
        return this._category;
    }

    get images(): string[] {
        return this._images;
    }

    static fromDto(dto: ItemDto): Item {
        return new Item(
            dto.id,
            dto.displayName,
            dto.desc,
            dto.price,
            dto.category,
            dto.images
        )
    }

    toDto(): ItemDto {
        return {
            id: this.id,
            displayName: this.displayName,
            desc: this.desc,
            price: this.price,
            category: this.category,
            images: this.images
        }
    }

    getFormattedItemPrice(){
        return new Intl.NumberFormat('de-AT',  {style: 'currency', currency: 'EUR'}).format(this.price)
    }
}