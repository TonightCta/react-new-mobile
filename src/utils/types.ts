import { Inner } from "../view/overview/components/balance_card"

export interface State{
    app_token?:string,
    account?:string,
    list_type?:number,
    filter_withdraw?:string,
    filter_deposit?:string,
    filter_fee?:string,
    merchant_id?:string,
    market?:string,
    deposit_fee?:Inner[],
    reload?:number
}

export enum Type{
    SET_TOKEN = 'set_token',
    SET_LIST_TYPE = 'set_list_type',
    SET_WITHDRAW_FILTER = 'set_withdraw_filter',
    SET_DEPOSIT_FILTER = 'set_deposit_filter',
    SET_ACCOUNT = 'set_account',
    SET_MERCHANT = 'set_merchant',
    SET_MARKET = 'set_market',
    SET_DEPOSIT_FEE = 'set_deposit_fee',
    SET_RELOAD = 'set_reload',
    SET_FILTER_FEE = 'set_filter_fee'
};

export interface FilterW{
    merchant:string,
    merchant_name:string,
    merchant_email:string,
    order_id:string,
    address:string,
    start:string,
    end:string,
    min:number | string,
    max:number | string,
    hash:string,
    coin:string,
    status:string | number
}

export interface FilterD{
    merchant:string,
    merchant_name:string,
    merchant_email:string,
    coin:string,
    order_id:string,
    address:string,
    start:string,
    end:string,
    min:string | number,
    max:string | number,
    hash:string
}

export interface IAction{
    type:string,
    payload:State
}

export interface Context{
    state:State,
    dispatch:(action:IAction) => void
}

export interface Find{
    email:string,
    code:number | string,
    new_pass:string,
    repeat_pass:string
}

export interface Login{
    email:string,
    password:string,
    auth_code:number | string
}

export interface IResponse {
    code: string | number,
    data: any,
    message: string
}