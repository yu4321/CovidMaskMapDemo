export class GeoJsonModel{
    code: string;
    name: string;
    addr: string;
    type: string;
    lat: number;
    lng: number;
    stock_at: string;
    remain_stat: string;
    created_at: string;
}

export class GeoJsonReq{
    lat: number;
    lng: number;
    m: number;
}