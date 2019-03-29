/* tslint:disable */
export class CreateConversationInput {
    homeId: string;
    type: string;
    recipientId: string;
}

export class CreateHomeFavoriteInput {
    homeFavoriteUserId?: string;
    homeFavoriteHomeId?: string;
}

export class CreateHomeInput {
    status?: string;
    schedule?: string;
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

export class CreateHomeMediaInput {
    homeId?: string;
    mimetype?: string;
    size?: number;
    url?: string;
}

export class DeleteHomeFavoriteInput {
    id: string;
}

export class DeleteHomeInput {
    id: string;
}

export class DeleteHomeMediaInput {
    id: string;
}

export class DeleteUserInput {
    id: string;
}

export class GetAVMDetailInput {
    address_1?: string;
    address_2?: string;
}

export class ModelBooleanFilterInput {
    ne?: boolean;
    eq?: boolean;
}

export class ModelFloatFilterInput {
    ne?: number;
    eq?: number;
    le?: number;
    lt?: number;
    ge?: number;
    gt?: number;
    contains?: number;
    notContains?: number;
    between?: number[];
}

export class ModelHomeFilterInput {
    id?: ModelIDFilterInput;
    owner?: ModelIDFilterInput;
    status?: ModelStringFilterInput;
    schedule?: ModelStringFilterInput;
    price?: ModelFloatFilterInput;
    price_adjustment?: ModelFloatFilterInput;
    descr?: ModelStringFilterInput;
    json?: ModelStringFilterInput;
    address_1?: ModelStringFilterInput;
    address_2?: ModelStringFilterInput;
    city?: ModelStringFilterInput;
    state?: ModelStringFilterInput;
    zip?: ModelStringFilterInput;
    country?: ModelStringFilterInput;
    beds?: ModelIntFilterInput;
    baths?: ModelFloatFilterInput;
    lot_size?: ModelFloatFilterInput;
    sqft?: ModelIntFilterInput;
    lat?: ModelFloatFilterInput;
    lng?: ModelFloatFilterInput;
    pool?: ModelBooleanFilterInput;
    fav_count?: ModelIntFilterInput;
    showing_count?: ModelIntFilterInput;
    buyers_agent?: ModelBooleanFilterInput;
    buyers_agent_amt?: ModelFloatFilterInput;
    buyers_agent_type?: ModelIntFilterInput;
}

export class ModelIDFilterInput {
    eq?: string;
}

export class ModelIntFilterInput {
    ne?: number;
    eq?: number;
    le?: number;
    lt?: number;
    ge?: number;
    gt?: number;
    contains?: number;
    notContains?: number;
    between?: number[];
}

export class ModelStringFilterInput {
    ne?: string;
    eq?: string;
    le?: string;
    lt?: string;
    ge?: string;
    gt?: string;
    contains?: string;
    notContains?: string;
    between?: string[];
    beginsWith?: string;
}

export class UpdateHomeInput {
    id: string;
    status?: string;
    schedule?: string;
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
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_num?: string;
    profile_img?: string;
    password?: string;
}

export class AVM {
    property?: Property;
    schools?: School[];
}

export class Conversation {
    id: string;
    home?: Home;
    type?: string;
    messages?: Message[];
    createdAt?: Date;
    updatedAt?: Date;
}

export class Home {
    id: string;
    owner?: User;
    status?: string;
    schedule?: string;
    media?: HomeMedia[];
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
    favorite?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class HomeFavorite {
    id: string;
    homeFavoriteUserId?: string;
    homeFavoriteHomeId?: string;
}

export class HomeMedia {
    id: string;
    homeId?: string;
    originalname?: string;
    mimetype?: string;
    size?: number;
    url?: string;
}

export class Message {
    id: string;
    author?: User;
    content: string;
    conversationId: string;
    type?: string;
    isSent?: boolean;
    isRead?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export abstract class IMutation {
    abstract createHome(createHomeInput?: CreateHomeInput): Home | Promise<Home>;

    abstract deleteHome(deleteHomeInput?: DeleteHomeInput): Home | Promise<Home>;

    abstract updateHome(updateHomeInput?: UpdateHomeInput): Home | Promise<Home>;

    abstract createHomeFavorite(createHomeFavoriteInput?: CreateHomeFavoriteInput): HomeFavorite | Promise<HomeFavorite>;

    abstract deleteHomeFavorite(deleteHomeFavoriteInput?: DeleteHomeFavoriteInput): HomeFavorite | Promise<HomeFavorite>;

    abstract createHomeMedia(createHomeMediaInput?: CreateHomeMediaInput): HomeMedia | Promise<HomeMedia>;

    abstract deleteHomeMedia(deleteHomeMediaInput?: DeleteHomeMediaInput): HomeMedia | Promise<HomeMedia>;

    abstract createConversation(conversationInput?: CreateConversationInput): UserConversation | Promise<UserConversation>;

    abstract createMessage(conversationId: string, content?: string, type?: string): Message | Promise<Message>;

    abstract deleteMessage(messageId: string, forEveryone?: boolean): boolean | Promise<boolean>;

    abstract markAsRead(messageId: string): boolean | Promise<boolean>;

    abstract startTyping(conversationId: string): boolean | Promise<boolean>;

    abstract stopTyping(conversationId: string): boolean | Promise<boolean>;

    abstract updateUser(updateUserInput?: UpdateUserInput): User | Promise<User>;

    abstract deleteUser(deleteUserInput?: DeleteUserInput): User | Promise<User>;
}

export class Property {
    address?: PropertyAddress;
    area?: PropertyArea;
    avm?: PropertyAVMDetails;
    building?: PropertyBuilding;
    identifier?: PropertyIdentifier;
    location?: PropertyLocation;
    lot?: PropertyLot;
    summary?: PropertySummary;
    utilities?: PropertyUtilities;
    vintage?: PropertyVintage;
}

export class PropertyAddress {
    country?: string;
    countrySubd?: string;
    line1?: string;
    line2?: string;
    locality?: string;
    matchCode?: string;
    oneLine?: string;
    postal1?: string;
    postal2?: string;
    postal3?: string;
}

export class PropertyArea {
    blockNum?: string;
    countyuse1?: string;
    countrysecsubd?: string;
    munname?: string;
    muncode?: string;
    subdname?: string;
    subdtractnum?: string;
    taxcodearea?: string;
}

export class PropertyAVMAmount {
    scr?: number;
    value?: number;
    high?: number;
    low?: number;
    valueRange?: number;
}

export class PropertyAVMCalculations {
    perSizeUnit?: number;
    ratioTaxAmt?: number;
    ratioTaxValue?: number;
    monthlyChgPct?: number;
    monthlyChgValue?: number;
    rangePctOfValue?: number;
}

export class PropertyAVMChange {
    avmlastmonthvalue?: number;
    avmamountchange?: number;
    avmpercentchange?: number;
}

export class PropertyAVMCondition {
    avmpoorlow?: number;
    avmpoorhigh?: number;
    avmpoorscore?: number;
    avmgoodlow?: number;
    avmgoodhigh?: number;
    avmgoodscore?: number;
    avmexcellentlow?: number;
    avmexcellenthigh?: number;
    avmexcellentscore?: number;
}

export class PropertyAVMDetails {
    amount?: PropertyAVMAmount;
    calculations?: PropertyAVMCalculations;
    condition?: PropertyAVMCondition;
    eventDate?: string;
    AVMChange?: PropertyAVMChange;
}

export class PropertyBuilding {
    construction?: PropertyBuildingConstruction;
    interior?: PropertyBuildingInterior;
    parking?: PropertyBuildingParking;
    rooms?: PropertyBuildingRooms;
    size?: PropertyBuildingSize;
    summary?: PropertyBuildingSummary;
}

export class PropertyBuildingConstruction {
    foundationtype?: string;
    frameType?: string;
    roofcover?: string;
    wallType?: string;
}

export class PropertyBuildingInterior {
    bsmtsize?: number;
    fplccount?: number;
}

export class PropertyBuildingParking {
    garagetype?: string;
    prkgSize?: number;
    prkgSpaces?: string;
    prkgType?: string;
}

export class PropertyBuildingRooms {
    bathfixtures?: number;
    baths1qtr?: number;
    baths3qtr?: number;
    bathscalc?: number;
    bathsfull?: number;
    bathshalf?: number;
    bathstotal?: number;
    beds?: number;
    roomsTotal?: number;
}

export class PropertyBuildingSize {
    bldgsize?: number;
    grosssize?: number;
    grosssizeadjusted?: number;
    groundfloorsize?: number;
    livingsize?: number;
    sizeInd?: string;
    universalsize?: number;
}

export class PropertyBuildingSummary {
    bldgsNum?: number;
    bldgType?: string;
    imprType?: string;
    levels?: number;
    mobileHomeInd?: string;
    quality?: string;
    storyDesc?: string;
    unitsCount?: string;
    yearbuilteffective?: number;
}

export class PropertyIdentifier {
    obPropId?: string;
    fips?: string;
    apn?: string;
    apnOrig?: string;
    attomId?: string;
}

export class PropertyLocation {
    accuracy?: string;
    elevation?: number;
    latitude?: string;
    longitude?: string;
    distance?: number;
    geoid?: string;
}

export class PropertyLot {
    depth?: number;
    frontage?: number;
    lotnum?: string;
    lotsize1?: number;
    lotsize2?: number;
    pooltype?: string;
}

export class PropertySummary {
    absenteeInd?: string;
    propclass?: string;
    propsubtype?: string;
    proptype?: string;
    yearbuilt?: number;
    propLandUse?: string;
    propIndicator?: string;
    legal1?: string;
}

export class PropertyUtilities {
    coolingtype?: string;
    heatingtype?: string;
    wallType?: string;
}

export class PropertyVintage {
    lastModified?: string;
    pubDate?: string;
}

export abstract class IQuery {
    abstract listHomes(filter?: ModelHomeFilterInput, limit?: number): Home[] | Promise<Home[]>;

    abstract myHomes(): Home[] | Promise<Home[]>;

    abstract getHome(id: string): Home | Promise<Home>;

    abstract getAVMDetail(getAVMDetailInput?: GetAVMDetailInput): AVM | Promise<AVM>;

    abstract getHomeFavorites(): HomeFavorite[] | Promise<HomeFavorite[]>;

    abstract getHomeFavorite(id: string): HomeFavorite | Promise<HomeFavorite>;

    abstract getHomeMedia(homeId: string): HomeMedia[] | Promise<HomeMedia[]>;

    abstract allConversations(): UserConversation[] | Promise<UserConversation[]>;

    abstract allMessages(conversationId: string, after?: number, limit?: number): Message[] | Promise<Message[]>;

    abstract me(): User | Promise<User>;

    abstract temp__(): boolean | Promise<boolean>;
}

export class School {
    Identifier?: SchoolIdentifier;
    SchoolProfileAndDistrictInfo?: SchoolProfileAndDistrictInfo;
    Vintage?: SchoolVintage;
}

export class SchoolContact {
    phone?: string;
    Prefixliteral?: string;
    Firstname?: string;
    Lastname?: string;
    Gender?: string;
    Englishtitle?: string;
    Websiteurl?: string;
}

export class SchoolDetail {
    educationClimateIndex?: string;
    advancedPlacement?: string;
    beforeandafterschoolprgms?: string;
    blueribbonschool?: string;
    charterschools?: string;
    giftedandtalented?: string;
    internationbaccalaureate?: string;
    magnetschool?: string;
    sitebased?: string;
    collegebound?: number;
    voctech?: string;
    adulteducationclasses?: string;
    adultother?: string;
    specialeducation?: string;
    alterantiveprogram?: string;
    yearroundclasses?: string;
    ESL?: string;
    Povertylevel?: string;
    Instructionalexpensepupil?: number;
    AYPschool?: string;
}

export class SchoolDistrictContact {
    Prefixliteral?: string;
    Firstname?: string;
    Lastname?: string;
    Gender?: string;
    Englishtitle?: string;
    Websiteurl?: string;
}

export class SchoolDistrictSummary {
    Obdistrictnumber?: string;
    districttype?: string;
    districtname?: string;
    COUNTY3?: string;
    COUNTYNAME?: string;
    COUNTY?: string;
    latitude?: number;
    longitude?: number;
    locationaddress?: string;
    locationcity?: string;
    fipsState?: string;
    stateabbrev?: string;
    zip54?: string;
    ZIP?: string;
    phone?: string;
    startDate?: string;
    endDate?: string;
    GStestrating?: number;
}

export class SchoolEnrollment {
    Enrollmentbygradeprek?: number;
    Enrollmentbygradekgtn?: number;
    Enrollmentbygradeone?: number;
    Enrollmentbygradetwo?: number;
    Enrollmentbygradethree?: number;
    Enrollmentbygradefour?: number;
    Enrollmentbygradefive?: number;
    Enrollmentbygradesix?: number;
    Enrollmentbygradeseven?: number;
    Enrollmentbygradeeight?: number;
    Enrollmentbygradenine?: number;
    Enrollmentbygradeten?: number;
    Enrollmentbygradeeleven?: number;
    Enrollmentbygradetwelve?: number;
    Enrollmentshift?: string;
    Studentsnumberof?: number;
    Studentsgrade?: number;
    Studentteacher?: string;
}

export class SchoolIdentifier {
    OBInstID?: string;
}

export class SchoolLocation {
    COUNTY3?: string;
    COUNTYNAME?: string;
    COUNTY?: string;
    geocodinglatitude?: number;
    geocodinglongitude?: number;
    locationaddress?: string;
    locationcity?: string;
    fipsState?: string;
    stateabbrev?: string;
    zip54?: string;
    ZIP?: string;
    Obdistrictnumber?: string;
    districttype?: string;
    districtname?: string;
    geoid?: string;
}

export class SchoolMeasurementResults {
    measureTypeId?: string;
    year?: string;
    subjectName?: string;
    grade?: string;
    measure?: string;
    insttype?: string;
}

export class SchoolMeasurementType {
    measureTypeId?: string;
    measuretype?: string;
    measureunits?: string;
    measurename?: string;
    measureabbrev?: string;
    resulttype?: string;
    scaledefinition?: string;
    rankmax?: string;
    year?: string;
    purposedescription?: string;
}

export class SchoolProfileAndDistrictInfo {
    DistrictContact?: SchoolDistrictContact;
    DistrictSummary?: SchoolDistrictSummary;
    MeasurementResults?: SchoolMeasurementResults[];
    MeasurementType?: SchoolMeasurementType[];
    Programs?: string[];
    SchoolEnrollment?: SchoolEnrollment;
    SchoolDetail?: SchoolDetail;
    SchoolContact?: SchoolContact;
    SchoolLocation?: SchoolLocation;
    SchoolSummary?: SchoolSummary;
    SchoolTech?: SchoolTech;
}

export class SchoolSummary {
    Filetypetext?: string;
    buildingtypetext?: string;
    institutionname?: string;
    startDate?: string;
    endDate?: string;
    gradelevel1lotext?: string;
    gradelevel1hitext?: string;
    gradelevel1locode?: string;
    gradelevel1hicode?: string;
    gradespancodebldgtext?: string;
    Preschool?: string;
    Elementary?: string;
    Middle?: string;
    High?: string;
    GStestrating?: number;
}

export class SchoolTech {
    Technologymeasuretype?: string;
    Computergrandtotal?: number;
    OStype?: string;
}

export class SchoolVintage {
    onboardDate?: string;
}

export abstract class ISubscription {
    abstract homeCreated(): Home | Promise<Home>;

    abstract homeUpdated(): Home | Promise<Home>;

    abstract homeDeleted(): Home | Promise<Home>;

    abstract homeFavoriteCreated(): HomeFavorite | Promise<HomeFavorite>;

    abstract homeMediaCreated(): HomeMedia | Promise<HomeMedia>;

    abstract homeMediaDeleted(): HomeMedia | Promise<HomeMedia>;

    abstract newMessage(): Message | Promise<Message>;

    abstract newUserConversation(): UserConversation | Promise<UserConversation>;

    abstract messageUpdated(): Message | Promise<Message>;

    abstract messageDeleted(): Message | Promise<Message>;

    abstract userConversationUpdated(): UserConversation | Promise<UserConversation>;

    abstract startTyping(): UserConversation | Promise<UserConversation>;

    abstract stopTyping(): UserConversation | Promise<UserConversation>;

    abstract userCreated(): User | Promise<User>;

    abstract userDeleted(): User | Promise<User>;
}

export class User {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone_num?: string;
    profile_img?: string;
    password?: string;
    provider?: string;
    socialId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserConversation {
    conversation?: Conversation;
    user?: User;
    message?: Message;
    createdAt?: Date;
    updatedAt?: Date;
}

export type Date = any;
