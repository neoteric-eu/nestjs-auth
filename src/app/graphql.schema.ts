/* tslint:disable */
export class CreateHomeFavoriteInput {
    homeFavoriteUserId?: string;
    homeFavoriteHomeId?: string;
}

export class CreateHomeInput {
    owner?: string;
    price?: number;
    price_adjustment?: number;
    descr?: string;
    json?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    beds?: number;
    baths?: number;
    lot_size?: number;
    sqft?: number;
    lat?: number;
    lng?: number;
    pool?: boolean;
    fav_count?: number;
    showing_count?: number;
    buyers_agent?: boolean;
    buyers_agent_amt?: number;
    buyers_agent_type?: number;
}

export class DeleteHomeFavoriteInput {
    id: string;
}

export class DeleteHomeInput {
    id: string;
}

export class DeleteUserInput {
    id: string;
}

export class UpdateHomeInput {
    id: string;
    owner?: string;
    price?: number;
    price_adjustment?: number;
    descr?: string;
    json?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    beds?: number;
    baths?: number;
    lot_size?: number;
    sqft?: number;
    lat?: number;
    lng?: number;
    pool?: boolean;
    fav_count?: number;
    showing_count?: number;
    buyers_agent?: boolean;
    buyers_agent_amt?: number;
    buyers_agent_type?: number;
}

export class UpdateUserInput {
    id: string;
    cratedAt?: string;
    updatedAt?: string;
    name?: string;
    email?: string;
    provider?: string;
    socialId?: string;
    password?: string;
}

export class Home {
    id: string;
    owner?: string;
    price?: number;
    price_adjustment?: number;
    descr?: string;
    json?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    beds?: number;
    baths?: number;
    lot_size?: number;
    sqft?: number;
    lat?: number;
    lng?: number;
    pool?: boolean;
    fav_count?: number;
    showing_count?: number;
    buyers_agent?: boolean;
    buyers_agent_amt?: number;
    buyers_agent_type?: number;
}

export class HomeFavorite {
    id: string;
    homeFavoriteUserId?: string;
    homeFavoriteHomeId?: string;
}

export abstract class IMutation {
    abstract createHome(createHomeInput?: CreateHomeInput): Home | Promise<Home>;

    abstract deleteHome(deleteHomeInput?: DeleteHomeInput): Home | Promise<Home>;

    abstract updateHome(updateHomeInput?: UpdateHomeInput): Home | Promise<Home>;

    abstract createHomeFavorite(createHomeFavoriteInput?: CreateHomeFavoriteInput): HomeFavorite | Promise<HomeFavorite>;

    abstract deleteHomeFavorite(deleteHomeFavoriteInput?: DeleteHomeFavoriteInput): HomeFavorite | Promise<HomeFavorite>;

    abstract updateUser(deleteUserInput?: DeleteUserInput): User | Promise<User>;

    abstract deleteUser(updateUserInput?: UpdateUserInput): User | Promise<User>;
}

export abstract class IQuery {
    abstract listHomes(): Home[] | Promise<Home[]>;

    abstract getHome(id: string): Home | Promise<Home>;

    abstract getHomeFavorites(): HomeFavorite[] | Promise<HomeFavorite[]>;

    abstract getHomeFavorite(id: string): HomeFavorite | Promise<HomeFavorite>;

    abstract me(id: string): Home | Promise<Home>;

    abstract temp__(): boolean | Promise<boolean>;
}

export abstract class ISubscription {
    abstract homeCreated(): Home | Promise<Home>;

    abstract homeFavoriteCreated(): HomeFavorite | Promise<HomeFavorite>;

    abstract userCreated(): User | Promise<User>;
}

export class User {
    id: string;
    cratedAt?: string;
    updatedAt?: string;
    name?: string;
    email?: string;
    provider?: string;
    socialId?: string;
    password?: string;
}
