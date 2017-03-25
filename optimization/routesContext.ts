import {Truck} from "../models/truck";

export class RouteContext {
    private readonly containers: any[];
    private readonly disposals: any[];
    private readonly depot: any;

    private trucks: Truck[];

    constructor(context){
        this.containers = context[0];
        this.disposals = context[1];
        this.depot = context[2];
    }

    static makeNew(context){
        return new RouteContext(context);
    }

    setTrucks(trucks){
        this.trucks = trucks;
    }

    getTrucks(): Truck[]{
        return this.trucks;
    }

    getContainers(){
        return this.containers.slice();
    }

    getDisposals(){
        return this.disposals.slice();
    }

    getDepot(){
        return this.depot;
    }
}