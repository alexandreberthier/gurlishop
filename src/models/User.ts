export interface PersonalData {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
}

export interface DeliveryData {
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export interface Item {
    id: string;
    displayName: string; // Der Name des Artikels
    price: number;
    quantity: number;
    images?: string[]; // Falls Bilder existieren
}



export interface Order {
    id: string;
    items: Item[];
    totalAmount: number;
    status: 'pending' | 'shipped';
    createdAt: Date;
    updatedAt?: Date;
    trackingNumber?: string;
}

export interface UserDTO {
    uid: string;
    personalData?: PersonalData;
    deliveryData?: DeliveryData;
    role?: 'user' | 'admin';
    createdAt?: Date;
    orders?: Order[];
}

export class User {
    private _uid: string;
    private _personalData?: PersonalData;
    private _deliveryData?: DeliveryData;
    private _role?: 'user' | 'admin';
    private _createdAt?: Date;
    private _orders?: Order[];

    constructor(
        uid: string,
        personalData?: PersonalData,
        deliveryData?: DeliveryData,
        role: 'user' | 'admin' = 'user',
        createdAt?: Date,
        orders: Order[] = []
    ) {
        this._uid = uid;
        this._personalData = personalData;
        this._deliveryData = deliveryData;
        this._role = role;
        this._createdAt = createdAt;
        this._orders = orders;
    }

    // Setter
    set uid(value: string) {
        this._uid = value;
    }

    set personalData(value: PersonalData) {
        this._personalData = value;
    }

    set deliveryData(value: DeliveryData | undefined) {
        this._deliveryData = value;
    }

    set role(value: 'user' | 'admin') {
        this._role = value;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }

    set orders(value: Order[]) {
        this._orders = value;
    }

    // Getter
    get uid(): string {
        return this._uid;
    }

    get personalData(): PersonalData | undefined {
        return this._personalData;
    }

    get deliveryData(): DeliveryData | undefined {
        return this._deliveryData;
    }

    get role(): 'user' | 'admin' | undefined {
        return this._role;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get orders(): Order[] | undefined {
        return this._orders;
    }


    static fromDto(dto: UserDTO): User {
        return new User(
            dto.uid,
            dto.personalData,
            dto.deliveryData,
            dto.role || 'user',
            dto.createdAt,
            dto.orders || []
        );
    }

    toDto(): UserDTO {
        const dto: UserDTO = {
            uid: this.uid,
            role: this.role,
            createdAt: this.createdAt,
            orders: this.orders || [],
        };

        if (this.personalData) {
            dto.personalData = this.personalData;
        }

        if (this.deliveryData) {
            dto.deliveryData = this.deliveryData;
        }

        return dto;
    }
}
